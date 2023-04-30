const User = require('../models/users');

// получить всех юзеров
const getUsers = (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка 500' });
    });
};

// получить юзера по id
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const { _id } = req.params;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      // console.log('err =>', err);
      const message = Object.values(err.errors).map((error) => error.message).join('; ');
      if (err.name === 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message });
      }
    });
};

// обновить данные профиля
// const updateUserInfo = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Пользователь не найден' });
//       } else {
//         res.status(500).send({ message: 'Ошибка 500' });
//       }
//     });
// };
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
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
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
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
