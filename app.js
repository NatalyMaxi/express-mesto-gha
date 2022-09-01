const express = require('express');

const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet'); // помогает защитить приложение от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Dotenv — это модуль с нулевой зависимостью, который загружает переменные среды из .envфайла в файлы process.env.
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const NotFoundError = require('./Error/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

app.use(helmet());
app.disable('x-powered-by'); // отключает заголовок X-Powered-By (заголовок обычно указывает платформу приложений, на которой работает сервер)

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    }),
  }),
  createUser,
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.use(auth); // защищает маршруты, которым нужны авторизация

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// Обработка запроса на несуществующий роут
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errors()); // обработчик ошибок celebrate

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Сервер запущен на ${PORT} порту`);
});
