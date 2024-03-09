const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ email: req.body.email });
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate password
    const passwordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    // Set token as a cookie
    res.cookie('token', token, { httpOnly: true });

    const data= {
      username: user?.username,
      email: user?.email,
      profilePicUrl: user?.profilePicUrl
    }

    res.json({ success: true, message: 'Login successful', data});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
