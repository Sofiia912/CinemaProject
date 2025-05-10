const express          = require('express');
const pool             = require('./database');
const { authenticate } = require('./auth');
const seats = express.Router();

seats.get('/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  // Отримуємо HallID
  const [[sess]] = await pool.query(
    `SELECT HallID
       FROM sessions
      WHERE SessionID = ?`,
    [sessionId]
  );
  if (!sess) {
    return res.status(404).json({ error: 'Сеанс не знайдено' });
  }
  // Всі крісла залу
  const [allSeats] = await pool.query(
    `SELECT SeatID, RowNumber, SeatNumber
       FROM seats
      WHERE HallID = ?
      ORDER BY RowNumber, SeatNumber`,
    [sess.HallID]
  );

  //Які SeatID вже заброньовані
  const [bookedRows] = await pool.query(
    `SELECT bs.SeatID
       FROM booking_seats bs
       JOIN bookings b ON bs.BookingID = b.BookingID
      WHERE b.SessionID = ?`,
    [sessionId]
  );
  const bookedSet = new Set(bookedRows.map(r => r.SeatID));

  // Повертаємо з полем isBooked
  res.json(allSeats.map(s => ({
    ...s,
    isBooked: bookedSet.has(s.SeatID)
  })));
});

module.exports = seats;
