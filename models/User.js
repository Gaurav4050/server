const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicUrl: String // Assuming profile pic URL is optional
});

const User = mongoose.model('User', userSchema);

module.exports = User;
