const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Формат почты указан не верно',
    },
    unique: true, // поле указывает, что почта должна быть уникальна
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    select: false, // поле выделяет область ввода объекта.
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
});

module.exports = mongoose.model('user', userSchema);
