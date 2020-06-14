const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtToken'));
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
