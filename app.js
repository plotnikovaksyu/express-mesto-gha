const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;
const { usersRoter } = require('./routes/users');
const { cardsRoter } = require('./routes/cards');
const { limiter } = require('./middleware/rate-limiter');

mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use((req, res, next) => {
//   req.user = {
//     _id: '644a51f4573e57da495dbb05',
//   };
//   next();
// });
app.use(limiter);
app.use(express.json());
app.use(usersRoter);

app.use(cardsRoter);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
