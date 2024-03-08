const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in Authorization header
  const tokenFromHeader = req.headers.authorization;

  // Check for token in cookies
  const tokenFromCookie = req.cookies.token;

  // Check if token exists in either header or cookie
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied, token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
