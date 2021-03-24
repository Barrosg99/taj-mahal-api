const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors');
const redis = require('../utils/redis');

module.exports = async (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) throw new AuthError('Missing Authorization Headers');

  const token = header.split(' ')[1];
  if (!token) throw new AuthError('Missing token');

  jwt.verify(token, process.env.SECRET, (err) => {
    if (err) throw new AuthError('Invalid token');
  });

  req.userId = await redis.getSession(token);
  if (!req.userId) throw new AuthError('Expired session');

  req.sessionId = token;

  next();
};
