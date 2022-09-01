const jsonwebtoken = require('jsonwebtoken');
const AuthorizationError = require('../Error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return res
      .status(401)
      .send({ message: 'Необходимо авторизироваться' });
  }
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError({ message: 'Необходимо авторизироваться' }));
  }
  req.user = payload;
  return next();
};
