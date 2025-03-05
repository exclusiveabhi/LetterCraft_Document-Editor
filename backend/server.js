const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Initialize passport configuration
require('./config/passport');

const app = express();

// Enable CORS for your frontend and allow credentials
app.use(cors({
  origin: 'http://localhost:5173', // update if your frontend port is different
  credentials: true
}));

app.use(express.json());

// Use express-session for session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true, // enable this if using https
    maxAge: 24 * 60 * 60 * 1000 // one day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Define routes for authentication and drive operations
app.use('/auth', require('./routes/auth'));
app.use('/api/drive', require('./routes/drive'));

app.get('/', (req, res) => {
  res.send("Backend server is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
