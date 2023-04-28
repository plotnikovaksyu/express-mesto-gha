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
      if (user) return res.send({ data: user });
      throw new Error('Пользователь не найдет');
    })
    .catch((err) => {
      // console.log('err =>', err.name);
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'ID не существует' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
      }
    });
};

// создать юзера
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        name,
        about,
        avatar,
        _id,
      });
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
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
      }
    });
};

// обновить аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
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
