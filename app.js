if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const pdf = require('html-pdf');
const session = require('express-session');
const flash = require('connect-flash');

// Import Student Model
const Student = require('./models/studentModel');
const User = require('./models/userModel');
const Score = require('./models/scoreModel');

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

app.get('/generate_pdf', async (req, res) => {
  const students = await Student.find({ preference: 'Offline' }).sort({ dept: 1, register_num: 1 });

  students.forEach((student, index) => {
    ejs.renderFile(path.join(__dirname, './views/', 'template.ejs'), { student: student }, (err, data) => {
      let options = {
        directory: '/pdf',
        format: 'A4',
        orientation: 'portrait',
        type: 'pdf',
      };
      pdf
        .create(data, options)
        .toFile(`${student.name} - ${student.register_num} (${student.dept}).pdf`, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(index);
          }
        });
    });
  });
  res.send('done');
});

app.get('/pdf/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('template', { student });
});

app.post('/', async (req, res) => {
  // Get register number from request body
  const registerNum = parseInt(req.body.registerNum);

  // Find student with register number
  const student = await Student.findOne({ register_num: registerNum }).populate('interviewers');

  if (student) {
    // Store studentId
    const studentId = student['_id'];

    // Get scores of the student
    const scores = await Score.find({ student: studentId }).populate('interviewer');

    res.render('view', { student, scores });
  } else {
    req.flash('error', "We couldn't generate your report. Please contact support");
    res.redirect('/');
  }
});

// Export app to server
module.exports = app;
