const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const CONFLICT_ERROR = require('../errors/conflictError');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

// получить всех юзеров
const getUsers = (req, res, next) => {
  User.find()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

// получить юзера по id
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь по указанному _id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// создать юзера
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const { _id } = user;
        return res.status(201).send({
          name,
          about,
          avatar,
          email,
          _id,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new CONFLICT_ERROR('Пользователь с такой почтой уже зарегистрирован'));
        } else if (err.name === 'ValidationError') {
          const message = Object.values(err.errors).map((error) => error.message).join('; ');
          next(new BAD_REQUEST_ERROR({ message }));
        } else {
          next(err);
        }
      }));
};

// обновить данные профиля
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// обновить аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// залогинить юзера
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UNAUTHORIZED_ERROR('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UNAUTHORIZED_ERROR('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          return res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
            .send({ jwt: token });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
};
