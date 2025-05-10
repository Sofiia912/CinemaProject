const express = require('express');
const pool = require('./database');
const { authenticate, authorizeRoles } = require('./auth');
require('dotenv').config();

const sessions = express.Router();

// /sessions — повертає лише майбутні сеанси з назвою фільму та залу
sessions.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         s.SessionID,
         s.StartAt,
         s.Price,
         m.Title   AS MovieTitle,
         m.PosterImg,
         h.Name    AS HallName
       FROM sessions s
       JOIN movies  m ON s.MovieID = m.MovieID
       JOIN halls   h ON s.HallID  = h.HallID
       WHERE s.StartAt > NOW()
       ORDER BY s.StartAt`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error GET /sessions:', err);
    res.status(500).json({ error: err.message });
  }
});

// /sessions/movie/:MovieID — повертає сеанси лише для одного фільму
sessions.get('/movie/:MovieID', async (req, res) => {
  try {
    const { MovieID } = req.params;
    const [rows] = await pool.query(
      `SELECT
         SessionID,
         StartAt,
         Price,
         PriceGood,
         PriceLux,
         HallID
       FROM sessions
       WHERE MovieID = ?
       ORDER BY StartAt`,
      [MovieID]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error GET /sessions/movie/:MovieID:', err);
    res.status(500).json({ error: err.message });
  }
});

// /sessions — створити сеанс (тільки admin)
sessions.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { MovieID, StartAt, HallID, Price, PriceGood, PriceLux } = req.body;
    if (
      MovieID == null ||
      !StartAt ||
      HallID == null ||
      Price == null ||
      PriceGood == null ||
      PriceLux == null
    ) {
      return res.status(400).json({ error: 'Усі поля обов’язкові' });
    }

    try {
      const [result] = await pool.query(
        `INSERT INTO sessions
           (MovieID, StartAt, HallID, Price, PriceGood, PriceLux)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [MovieID, StartAt, HallID, Price, PriceGood, PriceLux]
      );
      res.status(201).json({ SessionID: result.insertId, message: 'Сеанс створено' });
    } catch (err) {
      console.error('Error POST /sessions:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// /sessions/:SessionID — видалити сеанс (тільки admin)
sessions.delete(
  '/:SessionID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { SessionID } = req.params;
      const [result] = await pool.query(
        'DELETE FROM sessions WHERE SessionID = ?',
        [SessionID]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Сеанс не знайдено' });
      }
      res.json({ message: 'Сеанс видалено' });
    } catch (err) {
      console.error('Error DELETE /sessions/:SessionID:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// /sessions/:SessionID — повертає деталі конкретного сеансу
sessions.get('/:SessionID', async (req, res) => {
  const { SessionID } = req.params;
  const sql = `
    SELECT
      s.SessionID,
      s.MovieID,
      m.Title        AS MovieTitle,    
      DATE_FORMAT(s.StartAt, '%Y-%m-%d') AS Date,
      TIME_FORMAT(s.StartAt, '%H:%i:%s') AS Time,
      m.Duration,
      m.PosterImg,
      h.Name       AS HallName,
      s.Price,
      s.PriceGood,
      s.PriceLux,
      m.Genre      AS Format
    FROM sessions s
    JOIN movies  m ON s.MovieID = m.MovieID
    JOIN halls   h ON s.HallID  = h.HallID
    WHERE s.SessionID = ?
  `;
  try {
    const [[session]] = await pool.query(sql, [SessionID]);
    if (!session) return res.status(404).json({ error: 'Сеанс не знайдено' });
    res.json(session);
  } catch (err) {
    console.error('Error GET /sessions/:SessionID', err);
    res.status(500).json({ error: err.message });
  }
});

//  /sessions/:SessionID — оновити сеанс
sessions.put(
  '/:SessionID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    const { SessionID } = req.params;
    const { MovieID, StartAt, HallID, Price, PriceGood, PriceLux } = req.body;
    if (
      MovieID == null ||
      !StartAt ||
      HallID == null ||
      Price == null ||
      PriceGood == null ||
      PriceLux == null
    ) {
      return res.status(400).json({ error: 'Усі поля обов’язкові' });
    }

    try {
      const [result] = await pool.query(
        `UPDATE sessions
           SET MovieID   = ?,
               StartAt   = ?,
               HallID    = ?,
               Price     = ?,
               PriceGood = ?,
               PriceLux  = ?
         WHERE SessionID = ?`,
        [MovieID, StartAt, HallID, Price, PriceGood, PriceLux, SessionID]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Сеанс не знайдено' });
      }

      const [[updated]] = await pool.query(
        `SELECT SessionID, MovieID, StartAt, HallID, Price, PriceGood, PriceLux
           FROM sessions
          WHERE SessionID = ?`,
        [SessionID]
      );
      res.json(updated);
    } catch (err) {
      console.error('Error PUT /sessions/:SessionID', err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = sessions;