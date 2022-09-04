const routes = require('express').Router();

const {
  validationCreateCard,
  validationCardId,
} = require('../utils/utils');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routes.get('/', getCards);

routes.post('/', validationCreateCard, createCard);

routes.delete('/:cardId', validationCardId, deleteCard);

routes.put('/:cardId/likes', validationCardId, likeCard);

routes.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = routes;
