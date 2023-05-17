const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Недостаточно символов для поля "Имя"'],
    maxlength: [30, 'Недопустимое количество символов для поля "Имя"'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Недостаточно символов для поля "Описание"'],
    maxlength: [30, 'Недопустимое количество символов для поля "Описание"'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // validator(v) {
      //   return /^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/g.test(v);
      // },
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Некорректная ссылка на аватар',
    },
  },
  email: {
    type: String,
    required: [true, 'Обязательное поле для заполнения'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Некорректная почта',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле для заполнения'],
    minlength: [8, 'Слишком короткий пароль'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
