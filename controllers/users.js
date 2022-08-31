const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Error/NotFoundError');
const NotValidError = require('../Error/NotValidError');
const {
  ERROR_BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../utils/utils');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// Получаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    });
};

// Получаем пользователя по id
module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(err.statusCode).send({ message: err.message });
    } else if (err.name === 'CastError') {
      res.status(ERROR_BAD_REQUEST).send({ message: 'Некорректный id пользователя' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

// Создаем нового пользователя
module.exports.createUser = async (req, res) => {
  const {
    password, email, name, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashPassword, name, about, avatar,
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

// Обновляем данные пользователя
module.exports.updateUser = async (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  try {
    if (!name || !about) {
      throw new NotValidError('Переданы некорректные данные');
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(err.statusCode).send({ message: err.message });
    } else if (
      err.name === 'ValidationError'
      || err instanceof NotValidError
    ) {
      res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

// Обновляем аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};
