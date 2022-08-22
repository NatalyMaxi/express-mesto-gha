const Card = require('../models/card');
const NotFoundError = require('../Error/NotFoundError');

// Получаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

// Создаем карточку по id
module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

// Удаляем карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

// Ставим лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

// Убираем лайк у карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
