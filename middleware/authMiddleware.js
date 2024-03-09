const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in Authorization header
  const tokenFromHeader = req.headers.authorization;

  // Check for token in cookies
  const tokenFromCookie = req.cookies.token;
  const cookieToken= req?.headers?.cookies;

  console.log('Cookie token:', cookieToken);

  console.log('Token from header:', tokenFromHeader);
  console.log('Token from cookie:', tokenFromCookie);

  // Check if token exists in either header or cookie
  const token = tokenFromCookie;

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
