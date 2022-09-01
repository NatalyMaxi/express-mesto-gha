require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../Error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) {
    return next(new AuthorizationError('Необходимо авторизироваться'));
  } let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError('Необходимо авторизироваться'));
  } req.user = payload;
  return next();
};
