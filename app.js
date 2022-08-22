const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NotFoundError = require('./Error/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6301183df3a6c9a1afcafbe5',
  };

  next();
});

app.use('*', (req, res) => {
  try {
    throw new NotFoundError('Запрашиваемая страница не найдена');
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).send({ message: err.message });
    }
  }
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
