if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

// Import Student Model
const Student = require('./models/studentModel');
const User = require('./models/userModel');

// Instantiate express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static assets
app.use(express.static(path.join(__dirname, '/public')));

// Views and View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/'));

// Body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// express-session middleware
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// connect-flash middleware
app.use(flash());

// flash middleware
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  const registerNum = parseInt(req.body.registerNum);
  const student = await Student.findOne({ register_num: registerNum }).populate('interviewers');
  if (student) {
    res.render('view', { student });
  } else {
    req.flash('error', "We couldn't generate your report. Please contact support");
    res.redirect('/');
  }
});

// Export app to server
module.exports = app;
