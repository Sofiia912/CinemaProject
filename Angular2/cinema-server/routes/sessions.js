const express = require('express');
const pool = require('./database');
const sessions = express.Router();

// Отримати всі сеанси
sessions.get('/', async (req, res) => {
    try {
        const [sessionsList] = await pool.query(
            "SELECT * FROM sessions ORDER BY Date, Time"
        );
        res.json(sessionsList);
    } catch (error) {
        console.error("Помилка отримання всіх сеансів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});

// Отримати всі сеанси для конкретного фільму
sessions.get('/:MovieID', async (req, res) => {
    const { MovieID } = req.params;
    try {
        const [sessionsList] = await pool.query(
            "SELECT * FROM sessions WHERE MovieID = ? ORDER BY Date, Time",
            [MovieID]
        );
        res.json(sessionsList);
    } catch (error) {
        console.error("Помилка отримання сеансів:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});
// add new sessions
sessions.post('/', async (req, res) => {
    const { MovieID, Date, Time, Price, Hall } = req.body;

    if (!MovieID || !Date || !Time || !Price || !Hall) {
        return res.status(400).json({ error: "Усі поля обов'язкові!" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO sessions (MovieID, Date, Time, Price, Hall) VALUES (?, ?, ?, ?, ?)",
            [MovieID, Date, Time, Price, Hall]
        );

        res.status(201).json({ message: "Сеанс успішно створено", SessionID: result.insertId });
    } catch (error) {
        console.error("Помилка створення сеансу:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});

// Видалити сеанс
sessions.delete('/:SessionID', async (req, res) => {
    const { SessionID } = req.params;

    try {
        const [result] = await pool.query(
            "DELETE FROM sessions WHERE SessionID = ?",
            [SessionID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Сеанс не знайдено" });
        }

        res.json({ message: "Сеанс успішно видалено" });
    } catch (error) {
        console.error("Помилка видалення сеансу:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});
module.exports = sessions;





// // Get screening by ID with available seats
// router.get('/:id', async (req, res) => {
//   try {
//     const [screening] = await pool.query(`
//       SELECT s.*, m.title as movie_title, h.name as hall_name 
//       FROM screenings s
//       JOIN movies m ON s.movie_id = m.id
//       JOIN halls h ON s.hall_id = h.id
//       WHERE s.id = ?
//     `, [req.params.id]);

//     if (screening.length === 0) {
//       return res.status(404).json({ message: 'Screening not found' });
//     }

//     // Get available seats
//     const [bookedSeats] = await pool.query(`
//       SELECT seat_id FROM bookings 
//       WHERE screening_id = ? AND booking_status != 'cancelled'
//     `, [req.params.id]);

//     const bookedSeatIds = bookedSeats.map(booking => booking.seat_id);
    
//     const [allSeats] = await pool.query(`
//       SELECT * FROM seats WHERE hall_id = ?
//     `, [screening[0].hall_id]);

//     const availableSeats = allSeats.filter(seat => !bookedSeatIds.includes(seat.id));

//     res.json({
//       screening: screening[0],
//       availableSeats
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
