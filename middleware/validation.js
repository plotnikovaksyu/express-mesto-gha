const { celebrate, Joi } = require('celebrate');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-0-9/a-z()@:%.+~#=_]+\.{1}[a-z0-9]+\b[//a-z0-9()@:%_+.~#?&=]*/mi),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  createUserValidation,
};
