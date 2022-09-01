require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../Error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) {
    return next(new AuthorizationError('Необходима авторизация'));
  } let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  } req.user = payload;
  return next();
};
