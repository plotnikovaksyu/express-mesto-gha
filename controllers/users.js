const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const DEFAULT_ERROR = 500;
const UNAUTHORIZED_ERROR = 401;
const CONFLICT_ERROR = 409;

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

// создать юзера
const createUser = (req, res) => {
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
        res.status(201).send({
          name,
          about,
          avatar,
          email,
          _id,
        });
      })
      .catch((err) => {
        // console.log('err =>', err);
        if (err.code === 11000) {
          res.status(CONFLICT_ERROR).send('Пользователь с такой почтой уже зарегистрирован');
        } else if (err.name === 'ValidationError') {
          const message = Object.values(err.errors).map((error) => error.message).join('; ');
          res.status(BAD_REQUEST_ERROR).send({ message });
        } else {
          res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
        }
      }));
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

// залогинить юзера
const login = (req, res) => {
  const { email, password } = req.body;
  // User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
  //     return res.send({ token });
  //   })
  //   .catch((err) => {
  //     res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
  //   });

  // return User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
  //     // return res.send({ token });
  //     res.cookie('jwt', token, {
  //       maxAge: 3600000 * 24 * 7,
  //       httpOnly: true,
  //     })
  //       .send({ jwt: token });
  //   })
  //   .catch((err) => {
  //     res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
  //   });

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        return res.status(UNAUTHORIZED_ERROR).send('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new Error('Неправильные почта или пароль'));
            return res.status(UNAUTHORIZED_ERROR).send('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          // return res.send({ token });
          return res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
            .send({ jwt: token });
        });
    })
    .catch((err) => {
      // res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
      res.status(BAD_REQUEST_ERROR).send({ message: err.message });
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
