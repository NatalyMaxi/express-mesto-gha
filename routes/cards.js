const routes = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/card');

routes.get('/cards', getCards);

routes.post('/cards', createCard);

routes.delete('/cards/:cardId', deleteCard);

module.exports = routes;
