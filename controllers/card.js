const Card = require('../models/card');

// Получаем все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((e) => {
      res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    });
};

// Создаем карточку по id
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((e) => {
      res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    });
};

// Удаляем карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((e) => {
      res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    });
};
