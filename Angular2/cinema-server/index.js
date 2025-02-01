// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const movieRoutes = require('./routes/movies'); 
// const screeningRoutes = require('./routes/screenings'); 
// const bookingRoutes = require('./routes/bookings');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use('/api/movies', movieRoutes);
// app.use('/api/screenings', screeningRoutes);
// app.use('/api/bookings', bookingRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const express = require('express');
// const movies = require('./routes/movies');
// const cors = require('cors');
// const app = express();
// const PORT = 5001;

// app.use(cors());

// app.use('/movies', movies)

// const server = app.listen(PORT, ()=> {
//     console.log('APP is running on port 5001');
// })
const express = require('express');
const movies = require('./routes/movies');
const cors = require('cors');
const bodyParser = require('body-parser'); // Додано для роботи з JSON

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Парсинг JSON із запитів

// Маршрут для роботи з фільмами
app.use('/movies', movies);

const server = app.listen(PORT, () => {
    console.log(`APP is running on port ${PORT}`);
});
