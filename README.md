[![Tests](https://github.com/NatalyMaxi/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/NatalyMaxi/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/NatalyMaxi/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/NatalyMaxi/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

### :globe_with_meridians: О проекте
Back-end для проекта [Mesto.](https://github.com/NatalyMaxi/react-mesto-auth)

## :ticket: Функциональность
* регистрация пользователя (с сохранением хеша пароля в БД)
* аутентификация с выдачей JWT-токена и авторизация пользователя
* обновление данных профиля пользователя
* обновление аватара пользователя
* выдача массива карточек
* добавление карточки, удаление карточки, пользователя
* добавление/снятие лайка пользователя
* изменение счетчика лайка
* валидация данных с помощью Celebrate и регулярных выражений
* централизованная обработка ошибок
## :gem: Список используемых технологий
* Node.js
* Express.js
* MongoDB
* Mongoose
* Celebrate, Joi
* Winston
* dotenv
* bcryptjs
* helmet
* jsonwebtoken
* body-parser

 ### :open_file_folder: Директории
/routes — папка с файлами роутера
/controllers — папка с файлами контроллеров пользователя и карточки
/models — папка с файлами описания схем пользователя и карточки

### :ballot_box_with_check: Запуск проекта

* Клонировать репозиторий:

```console
    git clone https://github.com/NatalyMaxi/express-mesto-gha.git
```

* Перейти в папку проекта::

```console
    cd express-mesto-gha
```

* Установить зависимости:

```console
    npm install
```

* Запустить MongoDB::

```console
    mongod
```

* Запустить сервер:

```console
    npm run start
```

* Запустить сервер с hot-reload:

```console
    npm run dev
```

[Ссылка на объединенный front-end и back-end приложения Mesto](https://github.com/NatalyMaxi/react-mesto-api-full)
