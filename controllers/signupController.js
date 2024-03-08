const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    // Validate input
    // Ensure unique username and email
    // Hash password securely
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicUrl: req.body.profilePicUrl // assuming profile pic URL is optional
    });

    console.log(newUser);
    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set token as a cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
