const routes = require('express').Router();

const {
  validationUserId,
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../utils/utils');

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

routes.get('/', getUsers);

routes.get('/me', getCurrentUser);

routes.get('/:userId', validationUserId, getUserById);

routes.patch('/me', validationUpdateUser, updateUser);

routes.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = routes;
