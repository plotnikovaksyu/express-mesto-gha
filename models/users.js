const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательное поле для заполнения'],
    minlength: [2, 'Недостаточно символов для поля "Имя"'],
    maxlength: [30, 'Недопустимое количество символов для поля "Имя"'],
  },
  about: {
    type: String,
    required: [true, 'Обязательное поле для заполнения'],
    minlength: [2, 'Недостаточно символов для поля "Описание"'],
    maxlength: [30, 'Недопустимое количество символов для поля "Описание"'],
  },
  avatar: {
    type: String,
    required: [true, 'Обязательное поле для заполнения'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/g.test(v);
      },
      message: 'Введите URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
