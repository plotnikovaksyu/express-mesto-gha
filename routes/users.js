const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  // createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

const correctUrl = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const usersRoter = express.Router();

usersRoter.get('/users', getUsers);
usersRoter.get('/users/me', getUsers);
usersRoter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);
usersRoter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
usersRoter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(correctUrl),
  }),
}), updateAvatar);

module.exports = { usersRoter };
