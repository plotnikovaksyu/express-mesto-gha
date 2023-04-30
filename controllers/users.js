const User = require('../models/users');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const DEFAULT_ERROR = 500;

// получить всех юзеров
const getUsers = (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
    });
};

// получить юзера по id
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // const { _id } = req.params;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      // console.log('err =>', err);
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(BAD_REQUEST_ERROR).send({ message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

// обновить данные профиля
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

// обновить аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
