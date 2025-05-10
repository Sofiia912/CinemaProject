require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const { authenticate, authorizeRoles } = require('./routes/auth');
const movies    = require('./routes/movies');
const sessions  = require('./routes/sessions');
const bookings  = require('./routes/bookings');
const halls     = require('./routes/halls');
const seats     = require('./routes/seats');
const user      = require('./routes/user');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', user);             
app.use('/movies', movies);
app.use('/sessions', sessions);

app.use('/bookings', authenticate, bookings);
app.use('/halls', authenticate, authorizeRoles('admin'), halls);
app.use('/seats', seats);           

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
