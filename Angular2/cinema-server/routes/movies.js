// const express = require('express');
// const router = express.Router();
// const pool = require('../database');

// // Get all movies
// router.get('/', async (req, res) => {
//   try {
//     const [movies] = await pool.query('SELECT * FROM movies');
//     res.json(movies);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get movie by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const [movie] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
//     if (movie.length === 0) {
//       return res.status(404).json({ message: 'Movie not found' });
//     }
//     res.json(movie[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Create new movie
// router.post('/', async (req, res) => {
//   try {
//     const { title, description, duration, genre, release_date, poster_url } = req.body;
//     const [result] = await pool.query(
//       'INSERT INTO movies (title, description, duration, genre, release_date, poster_url) VALUES (?, ?, ?, ?, ?, ?)',
//       [title, description, duration, genre, release_date, poster_url]
//     );
//     const [newMovie] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
//     res.status(201).json(newMovie[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update movie
// router.put('/:id', async (req, res) => {
//   try {
//     const { title, description, duration, genre, release_date, poster_url } = req.body;
//     await pool.query(
//       'UPDATE movies SET title = ?, description = ?, duration = ?, genre = ?, release_date = ?, poster_url = ? WHERE id = ?',
//       [title, description, duration, genre, release_date, poster_url, req.params.id]
//     );
//     const [updatedMovie] = await pool.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
//     res.json(updatedMovie[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Delete movie
// router.delete('/:id', async (req, res) => {
//   try {
//     await pool.query('DELETE FROM movies WHERE id = ?', [req.params.id]);
//     res.json({ message: 'Movie deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;






// const express = require('express');
// const movies = express.Router();
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'cinema',
//     port: 3306,
//     multipleStatements: true
// });
// movies.get('/', (req, res) => {

//     pool.query('SELECT * FROM movies', (error, movies) => {
//          if(error) {
//             res.status(500).send(error);
//             } else {    
//              res.status(200).send(movies);
//             }
//     });      
// });
// // Create new movie
// router.post('/', async (req, res) => {
//   try {
//     const { Title, Description, Duration, Genre, ReleaseDate, PosterImg } = req.body;
//     const [result] = await pool.query(
//       'INSERT INTO movies (Title, Description, Duration, Genre, ReleaseDate, PosterImg) VALUES (?, ?, ?, ?, ?, ?)',
//       [Title, Description, Duration, Genre, ReleaseDate, PosterImg]
//     );
//     const [newMovie] = await pool.query('SELECT * FROM movies WHERE id = ?', [result.insertId]);
//     res.status(200).json(newMovie[0]);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// // // Search movies by title
// // movies.get('/movies/search/:title', (req, res) => {
// //     const query = 'SELECT * FROM movies WHERE Title LIKE ?';
// //     const searchTerm = `%${req.params.title}%`;
    
// //     connection.query(query, [searchTerm], (err, results) => {
// //       if (err) {
// //         console.error('Error searching movies:', err);
// //         res.status(500).json({ error: 'Error searching movies' });
// //         return;
// //       }
// //       res.json(results);
// //     });
// //   });

// module.exports = movies;









const express = require('express');
const mysql = require('mysql2/promise'); // Використання `mysql2/promise` для роботи з асинхронними запитами

const movies = express.Router();

// Налаштування з'єднання з базою даних
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cinema',
    port: 3306,
    multipleStatements: true
});

// Отримати всі фільми
movies.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movies');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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


// // Пошук фільмів за назвою
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

// movies.get('/search/:title', async (req, res) => {
//     try {
//         const searchTerm = `%${req.params.title}%`;
//         const [results] = await pool.query('SELECT * FROM movies WHERE Title LIKE ?', [searchTerm]);
//         console.log(results);
//         res.status(200).json(results);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = movies;
