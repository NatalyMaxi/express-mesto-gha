const routes = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

routes.get('/users', getUsers);

routes.get('/users/:userId', getUserById);

routes.patch('/users/me', updateUser);

routes.get('/users/me', getCurrentUser);

routes.patch('/users/me/avatar', updateAvatar);

module.exports = routes;
