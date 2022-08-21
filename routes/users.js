const routes = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routes.get('/users', getUsers);

routes.get('/users/:userId', getUserById);

routes.post('/users', createUser);

routes.patch('/users/me', updateUser);

routes.patch('/users/me/avatar', updateAvatar);

module.exports = routes;
