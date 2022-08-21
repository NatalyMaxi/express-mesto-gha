const User = require('../models/user');

// Получаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((e) => {
      res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
    });
};

// Получаем пользователя по id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка на сервере', ...e }));
};

// Создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка на сервере', ...e }));
};

// Обновляем данные пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка на сервере', ...e }));
};

// Обновляем аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => res.status(500).send({ message: 'Произошла ошибка на сервере', ...e }));
};
