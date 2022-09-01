const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Произошла ошибка на сервере';

  res.status(status).send({
    err,
    message,
  });
  next();
};

module.exports = errorHandler;
