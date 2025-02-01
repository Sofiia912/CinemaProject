// const express = require('express');
// const router = express.Router();
// const pool = require('../database');
// router.post('/', async (req, res) => {
//     const connection = await pool.getConnection();
//     try {
//       await connection.beginTransaction();
  
//       const { screening_id, seat_id, customer_name, customer_email } = req.body;
  
//       // Check if seat is available
//       const [existingBooking] = await connection.query(
//         'SELECT * FROM bookings WHERE screening_id = ? AND seat_id = ? AND booking_status != "cancelled"',
//         [screening_id, seat_id]
//       );
  
//       if (existingBooking.length > 0) {
//         await connection.rollback();
//         return res.status(400).json({ message: 'Seat is already booked' });
//       }
  
//       // Create booking
//       const [result] = await connection.query(
//         'INSERT INTO bookings (screening_id, seat_id, customer_name, customer_email) VALUES (?, ?, ?, ?)',
//         [screening_id, seat_id, customer_name, customer_email]
//       );
  
//       await connection.commit();
      
//       const [newBooking] = await connection.query('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
//       res.status(201).json(newBooking[0]);
//     } catch (error) {
//       await connection.rollback();
//       res.status(500).json({ message: error.message });
//     } finally {
//       connection.release();
//     }
//   });
  
//   // Get booking by ID
//   router.get('/:id', async (req, res) => {
//     try {
//       const [booking] = await pool.query(`
//         SELECT b.*, s.start_time, m.title as movie_title
//         FROM bookings b
//         JOIN screenings s ON b.screening_id = s.id
//         JOIN movies m ON s.movie_id = m.id
//         WHERE b.id = ?
//       `, [req.params.id]);
  
//       if (booking.length === 0) {
//         return res.status(404).json({ message: 'Booking not found' });
//       }
  
//       res.json(booking[0]);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   // Cancel booking
//   router.put('/:id/cancel', async (req, res) => {
//     try {
//       await pool.query(
//         'UPDATE bookings SET booking_status = "cancelled" WHERE id = ?',
//         [req.params.id]
//       );
//       res.json({ message: 'Booking cancelled successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
//   module.exports = router;