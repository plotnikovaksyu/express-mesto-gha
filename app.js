const express = require('express');

const app = express();
const { PORT } = process.env;
const mongoose = require('mongoose');
const { usersRoter } = require('./routes/users');
const { cardsRoter } = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '644a51f4573e57da495dbb05',
  };
  next();
});

app.use(express.json());
app.use(usersRoter);

app.use(cardsRoter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
