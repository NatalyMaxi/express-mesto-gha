const bcrypt = require('bcryptjs'); // модуль для хеширования пароля
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../Error/NotFoundError');
const NotValidError = require('../Error/NotValidError');
const CastError = require('../Error/CastError');
const ConflictError = require('../Error/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ // получаем объект пользователя
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
    })
    .catch(next);
};

// Получаем всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

// Получаем пользователя по id
module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CastError('Некорректный id пользователя'));
    } else {
      next(err);
    }
  }
};

// Создаем нового пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    res.status(200).send({
      user: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      },
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Такой Email уже зарегистрирован'));
    } else {
      next(err);
    }
  }
};

// Обновляем данные пользователя
module.exports.updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidError('Переданы некорректные данные'));
    } else {
      next(error);
    }
  }
};

// Получаем информацию о пользователе
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  }).catch(next);
};

// Обновляем аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CastError('Передана Некорректная ссылка'));
      }
      return next(err);
    });
};
