const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
} = require('../controllers/users');

const auth = require('../middleware/auth');

const usersRoter = express.Router();

usersRoter.post('/signin', login);
usersRoter.post('/signup', createUser);

usersRoter.use(auth);

usersRoter.get('/users', getUsers);
usersRoter.get('/users/:userId', getUser);
// usersRoter.post('/users', createUser);
usersRoter.patch('/users/me', updateUserInfo);
usersRoter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRoter };
