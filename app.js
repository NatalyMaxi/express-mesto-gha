const express = require('express');

const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // помогает защитить приложение от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); // Dotenv — это модуль с нулевой зависимостью, который загружает переменные среды из .envфайла в файлы process.env.
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const errorHandler = require('./middlewares/errorHandler');
const {
  validationCreateUser,
  validationLogin,
} = require('./utils/utils');

const NotFoundError = require('./Error/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', validationLogin, login);

app.post('/signup', validationCreateUser, createUser);

app.use(auth); // защищает маршруты, которым нужны авторизация

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработка запроса на несуществующий роут

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Сервер запущен на ${PORT} порту`);
});
