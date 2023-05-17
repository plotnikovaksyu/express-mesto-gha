const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middleware/auth');

const app = express();
const { PORT = 3000 } = process.env;
const { usersRoter } = require('./routes/users');
const { cardsRoter } = require('./routes/cards');
const { limiter } = require('./middleware/rate-limiter');
const { createUser, login } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(limiter);
app.use(express.json());

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(/https?:\/\/(www\.)?[-0-9/a-z()@:%.+~#=_]+\.{1}[a-z0-9]+\b[//a-z0-9()@:%_+.~#?&=]*/mi),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use(usersRoter);

app.use(cardsRoter);

app.use(errors());
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
