const express = require('express');
const pool = require('./database');
const { authenticate, authorizeRoles } = require('./auth');
require('dotenv').config();

const movies = express.Router();

// усі фільми 
movies.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// пошук фільмів за назвою 
movies.get('/search/:title', async (req, res) => {
  try {
    const searchTerm = `%${req.params.title}%`;
    const [results] = await pool.query(
      'SELECT * FROM movies WHERE Title LIKE ?', 
      [searchTerm]
    );
    return res.status(200).json(results);
  } catch (err) {
    console.error('Помилка при пошуку за назвою:', err);
    return res.status(500).json({ error: err.message });
  }
});

// пошук фільмів за ключовим словом 
movies.get('/search/keyword/:keyword', async (req, res) => {
  try {
    const kw = `%${req.params.keyword}%`;
    const [results] = await pool.query(
      'SELECT * FROM movies WHERE keywords LIKE ?', 
      [kw]
    );
    return res.status(200).json(results);
  } catch (err) {
    console.error('Помилка при пошуку за ключовим словом:', err);
    return res.status(500).json({ error: err.message });
  }
});

// фільм за ID 
movies.get('/:MovieID', async (req, res) => {
  try {
    const { MovieID } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM movies WHERE MovieID = ?',
      [MovieID]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Фільм не знайдено' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// створити фільм — тільки admin
movies.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const {
        Title,
        Description,
        Duration,
        Genre,
        ReleaseDate,
        Director,
        PosterImg,
        Language,
        keywords
      } = req.body;
      const [result] = await pool.query(
        `INSERT INTO movies
           (Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language, keywords)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Title,
          Description,
          Duration,
          Genre,
          ReleaseDate,
          Director,
          PosterImg,
          Language,
          keywords
        ]
      );
      const [[newMovie]] = await pool.query(
        'SELECT * FROM movies WHERE MovieID = ?',
        [result.insertId]
      );
      res.status(201).json(newMovie);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// оновити фільм — тільки admin
movies.put(
  '/:MovieID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { MovieID } = req.params;
      const {
        Title,
        Description,
        Duration,
        Genre,
        ReleaseDate,
        Director,
        PosterImg,
        Language,
        keywords
      } = req.body;
      await pool.query(
        `UPDATE movies SET
           Title       = ?,
           Description = ?,
           Duration    = ?,
           Genre       = ?,
           ReleaseDate = ?,
           Director    = ?,
           PosterImg   = ?,
           Language    = ?,
           keywords    = ?
         WHERE MovieID = ?`,
        [
          Title,
          Description,
          Duration,
          Genre,
          ReleaseDate,
          Director,
          PosterImg,
          Language,
          keywords,
          MovieID
        ]
      );
      const [[updated]] = await pool.query(
        'SELECT * FROM movies WHERE MovieID = ?',
        [MovieID]
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE фільму — тільки admin
movies.delete(
  '/:MovieID',
  authenticate,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { MovieID } = req.params;
      const [result] = await pool.query(
        'DELETE FROM movies WHERE MovieID = ?',
        [MovieID]
      );
      if (!result.affectedRows) {
        return res.status(404).json({ error: 'Фільм не знайдено' });
      }
      res.json({ message: 'Фільм видалено' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = movies;
