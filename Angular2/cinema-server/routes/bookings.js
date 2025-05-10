const express          = require('express');
const pool             = require('./database');
const { authenticate } = require('./auth');

const bookings = express.Router();

bookings.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { SessionID, Seats } = req.body;

  // Валідація
  if (typeof SessionID !== 'number'
      || !Array.isArray(Seats)
      || Seats.length === 0
      || Seats.some(s => typeof s !== 'number')) {
    return res.status(400).json({
      error: 'SessionID має бути числом, Seats — масив чисел'
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Блокуємо сеанс
    const [[sess]] = await conn.query(
      `SELECT PriceGood, PriceLux, HallID
         FROM sessions
        WHERE SessionID = ? FOR UPDATE`,
      [SessionID]
    );
    if (!sess) throw { status: 404, error: 'Сеанс не знайдено' };

    // Блокуємо вже заброньовані місця
    await conn.query(
      `SELECT SeatID
         FROM booking_seats
        WHERE SessionID = ? AND SeatID IN (?) FOR UPDATE`,
      [SessionID, Seats]
    );

    // Отримуємо ряди для підрахунку ціни
    const [seatInfos] = await conn.query(
      `SELECT RowNumber
         FROM seats
        WHERE HallID = ? AND SeatID IN (?)`,
      [sess.HallID, Seats]
    );
    if (seatInfos.length !== Seats.length) {
      throw { status: 400, error: 'Деякі SeatID не знайдені в залі' };
    }

    // Рахуємо totalPrice
    const maxRow = Math.max(...seatInfos.map(s => s.RowNumber));
    const luxThreshold = maxRow - 1;
    let sum = 0;
    for (const s of seatInfos) {
      sum += s.RowNumber >= luxThreshold
        ? parseFloat(sess.PriceLux)
        : parseFloat(sess.PriceGood);
    }

    // Вставляємо основне бронювання
    const [bk] = await conn.query(
      `INSERT INTO bookings
         (UserID, SessionID, TotalPrice, CreatedAt)
       VALUES (?, ?, ?, NOW())`,
      [userId, SessionID, sum.toFixed(2)]
    );
    const bookingId = bk.insertId;

    // Вставляємо по одному в booking_seats
    const seatRows = Seats.map(id => [bookingId, SessionID, id]);
    await conn.query(
      `INSERT INTO booking_seats (BookingID, SessionID, SeatID)
             VALUES ?`,
      [seatRows]
    );

    await conn.commit();
    res.status(201).json({
      BookingID:  bookingId,
      TotalPrice: +sum.toFixed(2),
      message:    'Бронювання створено'
    });

  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Хтось саме-но забронював одне з цих місць, спробуйте ще раз'
      });
    }
    const status = err.status || 500;
    res.status(status).json({ error: err.error || err.message });
  } finally {
    conn.release();
  }
});

bookings.get('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  try {
    // Базові дані + PosterImg
    const [rows] = await pool.query(
      `SELECT
         b.BookingID,
         b.SessionID,
         b.TotalPrice,
         b.CreatedAt,
         s.StartAt,
         m.Title       AS MovieTitle,
         m.PosterImg,
         h.HallID
       FROM bookings b
       JOIN sessions      s ON b.SessionID = s.SessionID
       JOIN movies        m ON s.MovieID   = m.MovieID
       JOIN halls         h ON s.HallID    = h.HallID
       WHERE b.UserID = ?
       ORDER BY b.CreatedAt DESC`,
      [userId]
    );

    const results = [];

    // Для кожного бронювання дістаємо інформацію про місця
    for (const r of rows) {
      // витягуємо ряди і номери місць
      const [seatRows] = await pool.query(
        `SELECT
           bs.SeatID,
           st.RowNumber,
           st.SeatNumber
         FROM booking_seats bs
         JOIN seats st ON bs.SeatID = st.SeatID
        WHERE bs.BookingID = ?
        ORDER BY st.RowNumber, st.SeatNumber`,
        [r.BookingID]
      );

      // Знаходимо максимальний ряд для цього залу
      const [[{ maxRow }]] = await pool.query(
        `SELECT MAX(RowNumber) AS maxRow
           FROM seats
          WHERE HallID = ?`,
        [r.HallID]
      );
      const luxThreshold = maxRow - 1;

      // Формуємо масив місць з типом
      const seats = seatRows.map(s => ({
        SeatID:     s.SeatID,
        RowNumber:  s.RowNumber,
        SeatNumber: s.SeatNumber,
        Type:       s.RowNumber >= luxThreshold ? 'SUPER_LUX' : 'GOOD'
      }));

      results.push({
        BookingID:  r.BookingID,
        SessionID:  r.SessionID,
        MovieTitle: r.MovieTitle,
        PosterImg:  r.PosterImg,
        StartAt:    r.StartAt,
        Seats:      seats,
        TotalPrice: r.TotalPrice,
        CreatedAt: r.CreatedAt,
        HallID:     r.HallID 
      });
    }

    res.json(results);
  } catch (err) {
    console.error('Error GET /bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

bookings.delete('/:BookingID', authenticate, async (req, res) => {
  const userId    = req.user.id;
  const { BookingID } = req.params;
  try {
    const [result] = await pool.query(
      `DELETE FROM bookings
         WHERE BookingID = ? AND UserID = ?`,
      [BookingID, userId]
    );
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Бронювання не знайдено' });
    }
    res.json({ message: 'Бронювання скасовано' });
  } catch (err) {
    console.error('Error DELETE /bookings/:BookingID', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = bookings;