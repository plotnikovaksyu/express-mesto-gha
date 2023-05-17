const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  // login,
} = require('../controllers/users');

const usersRoter = express.Router();

// usersRoter.post('/signin', login);
// usersRoter.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//     avatar: Joi.string()
// .pattern(/https?:\/\/(www\.)?[-0-9/a-z()@:%.+~#=_]+\.{1}[a-z0-9]+\b[//a-z0-9()@:%_+.~#?&=]*/mi),
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), createUser);

// usersRoter.use(auth);

usersRoter.get('/users', getUsers);
usersRoter.get('/users/:userId', getUser);
usersRoter.post('/users', createUser);
usersRoter.patch('/users/me', updateUserInfo);
usersRoter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRoter };
