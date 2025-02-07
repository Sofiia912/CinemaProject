const express = require('express');
const pool = require('./database');
const movies = express.Router();

// Отримати всі фільми
movies.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Update movie
movies.put('/:MovieID', async (req, res) => {
  try {
    const { Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language } = req.body;
    await pool.query(
      'UPDATE movies SET Title = ?, Description = ?, Duration = ?, Genre = ?, ReleaseDate = ?, Director = ?, PosterImg = ?, Language = ? WHERE MovieID = ?',
      [Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language, req.params.MovieID]
    );
    const [updatedMovie] = await pool.query('SELECT * FROM movies WHERE MovieID = ?', [req.params.MovieID]);
    res.json(updatedMovie[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  стоворення нового фільму new 
movies.post('/', async (req, res) => {
  try {
      const { Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language } = req.body;

      const [result] = await pool.query(
          'INSERT INTO movies (Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [Title, Description, Duration, Genre, ReleaseDate, Director, PosterImg, Language]
      );
      const [newMovie] = await pool.query('SELECT * FROM movies WHERE MovieID = ?', [result.insertId]);
      res.status(200).json(newMovie[0]);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// видалення 
movies.delete('/:MovieID', async (req, res) => {
  try {
      const { MovieID } = req.params;
      const [result] = await pool.query('DELETE FROM movies WHERE MovieID = ?', [MovieID]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: `Фільм з ID ${MovieID} не знайдено.` });
      }
      res.status(200).json({ message: `Фільм з ID ${MovieID} успішно видалено.` });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


// Пошук фільмів за назвою
movies.get('/search/:title', async (req, res) => { 
    try {
        const searchTerm = `%${req.params.title}%`;
        console.log('Пошук фільму за назвою:', req.params.title); // Логування
        const [results] = await pool.query('SELECT * FROM movies WHERE Title LIKE ?', [searchTerm]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Фільми не знайдено" });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Помилка при пошуку:", error);
        res.status(500).json({ message: error.message });
    }
});


// Маршрут для отримання фільму за ID
movies.get('/:MovieID', async (req, res) => {
    try {
        const { MovieID } = req.params;
        const [result] = await pool.query('SELECT * FROM movies WHERE MovieID = ?', [MovieID]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Фільм не знайдено' });
        }
        res.json(result[0]); // Повертаємо об'єкт фільму
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = movies;
