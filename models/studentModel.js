const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
  register_num: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dept: {
    type: String,
    enum: ['AUT', 'BIO', 'CHE', 'CIV', 'CSE', 'ECE', 'EEE', 'INT', 'MEC'],
    required: true,
  },
  section: {
    type: String,
    enum: ['A', 'B', 'C', ''],
  },
  email: {
    type: String,
    required: true,
  },
  preference: {
    type: String,
    enum: ['Offline', 'Online'],
    required: true,
  },
  gd_scores: {
    type: Object,
    required: true,
  },
  aptitude_scores: {
    type: Object,
    required: true,
  },
  interviewers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Student = mongoose.model('Student', StudentSchema, 'Students');
module.exports = Student;
