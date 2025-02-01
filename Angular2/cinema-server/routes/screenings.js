// const express = require('express');
// const router = express.Router();
// const pool = require('../database');

// // Get all screenings
// router.get('/', async (req, res) => {
//   try {
//     const [screenings] = await pool.query(`
//       SELECT s.*, m.Title as movie_title, h.name as hall_name 
//       FROM screenings s
//       JOIN movies m ON s.movie_id = m.id
//       JOIN halls h ON s.hall_id = h.id
//     `);
//     res.json(screenings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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

// // Create new screening
// router.post('/', async (req, res) => {
//   try {
//     const { movie_id, hall_id, start_time, price } = req.body;
//     const [result] = await pool.query(
//       'INSERT INTO screenings (movie_id, hall_id, start_time, price) VALUES (?, ?, ?, ?)',
//       [movie_id, hall_id, start_time, price]
//     );
//     const [newScreening] = await pool.query('SELECT * FROM screenings WHERE id = ?', [result.insertId]);
//     res.status(201).json(newScreening[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });