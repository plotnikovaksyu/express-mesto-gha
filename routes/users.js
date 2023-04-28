const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

const usersRoter = express.Router();

usersRoter.get('/users', getUsers);
usersRoter.get('/users/:userId', getUser);
usersRoter.post('/users', createUser);
usersRoter.patch('/users/me', updateUserInfo);
usersRoter.patch('/users/me/avatar', updateAvatar);

module.exports = { usersRoter };
