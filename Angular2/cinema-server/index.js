const express = require('express');
const movies = require('./routes/movies');
const sessions = require('./routes/sessions'); 
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Парсинг JSON із запитів

// Маршрут для роботи з фільмами
app.use('/movies', movies);

// Маршрут для роботи з сеансами
app.use('/sessions', sessions);

app.listen(PORT, () => {
    console.log(`APP is running on port ${PORT}`);
});
