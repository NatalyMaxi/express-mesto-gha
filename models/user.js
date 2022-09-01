const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../Error/AuthorizationError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Формат почты указан не верно',
    },
    unique: true, // поле указывает, что почта должна быть уникальна
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false, // чтобы по умолчанию хеш пароля пользователя не возвращалс из базы.
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  validate: {
    validator: (link) => validator.isURL(link),
    message: 'Формат адреса указан не верно',
  },
});

// отключаем следующую строчку с неименованной функцией
// eslint-disable-next-line
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthorizationError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
