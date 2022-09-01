const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isUrlValid } = require('../utils/utils');

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

routes.get('/', getUsers);
routes.get('/me', getCurrentUser);
routes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

routes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

routes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(isUrlValid),
  }),
}), updateAvatar);

module.exports = routes;
