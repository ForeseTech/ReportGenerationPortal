const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['Interviewer', 'Admin'],
  },
  company: {
    type: String,
    required: [
      function () {
        return this.role === 'Interviewer';
      },
    ],
  },
  date: {
    type: Date,
    required: [
      function () {
        return this.role === 'User';
      },
    ],
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
    },
  ],
});

const User = mongoose.model('User', UserSchema, 'Users');
module.exports = User;
