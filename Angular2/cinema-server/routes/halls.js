const express = require('express');
const pool = require('./database');
const { authenticate, authorizeRoles } = require('./auth');
const halls   = express.Router();

// всі зали
halls.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM halls');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// створити зал (тільки admin)
halls.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { Name, Capacity, Description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO halls (Name, Capacity, Description) VALUES (?, ?, ?)',
      [Name, Capacity, Description]
    );
    const [[newHall]] = await pool.query(
      'SELECT * FROM halls WHERE HallID = ?',
      [result.insertId]
    );
    res.status(201).json(newHall);
  }
);
// /halls/:HallID — оновлення залу
halls.put(
  '/:HallID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { HallID } = req.params;
    const { Name, Capacity, Description } = req.body;
    try {
      const [result] = await pool.query(
        `UPDATE halls
            SET Name = ?, Capacity = ?, Description = ?
          WHERE HallID = ?`,
        [Name, Capacity, Description, HallID]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Зал не знайдено' });
      }
      const [[updated]] = await pool.query(
        'SELECT * FROM halls WHERE HallID = ?',
        [HallID]
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// /halls/:HallID — видалення залу
halls.delete(
  '/:HallID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { HallID } = req.params;
    try {
      const [result] = await pool.query(
        'DELETE FROM halls WHERE HallID = ?',
        [HallID]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Зал не знайдено' });
      }
      res.json({ message: 'Зал видалено' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = halls;
