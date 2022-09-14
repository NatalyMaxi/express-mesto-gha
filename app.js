const express = require('express');

const cors = require('cors');
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

const options = {
  origin: {
    origin: [ // Массив доменов, с которых разрешены кросс-доменные запросы.
      'http://localhost:3000',
      'https://domainname.nataly.nomoredomains.sbs',
      'https://praktikum.tk',
      'http://praktikum.tk',
      'localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // настраивает заголовок CORS Access-Control-Allow-Methods.
    preflightContinue: false, // передать предварительный ответ CORS следующему обработчику.
    optionsSuccessStatus: 204, // Предоставляет код состояния для успешных OPTIONSзапросов.
  },
  credentials: true, // сообщает браузерам, следует ли предоставлять ответ внешнему коду JS.
};

const { PORT = 3000 } = process.env;

const app = express();

app.use('*', cors(options));

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

// для проверки ревьювером, что сервер падает и Pm2 должен его восстановить
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); // Не забыть удалить этот код после успешного прохождения ревью

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
