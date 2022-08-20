const routes = require('express').Router();

const { getUsers, getUserById, createUser } = require('../controllers/users');

routes.get('/users', getUsers);

routes.get('/users/:userId', getUserById);

routes.post('/users', createUser);

module.exports = routes;
