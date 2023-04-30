const Card = require('../models/cards');
const User = require('../models/users');

// получить все карточки
const getCards = (req, res) => {
  Card.find()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка 500' });
    });
};

// создать новую карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      const { _id } = card;
      res.status(201).send({
        name,
        link,
        owner: req.user._id,
        _id,
      });
    })
    .catch((err) => {
      const message = Object.values(err.errors).map((error) => error.message).join('; ');
      if (err.name === 'ValidationError') {
        res.status(400).send({ message });
      } else {
        res.status(500).send({ message });
      }
    });
};

// удалить карточку
// const deleteCard = (req, res) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
//         res.status(404).send({ message: 'Недостаточно прав для удаления карточки' });
//       } else {
//         Card.findByIdAndDelete(req.params.cardId)
//           .then((deletedCard) => {
//             if (deletedCard) {
//               res.status(200).send(deletedCard);
//             } else {
//               res.status(404).send({ message: 'Карточка не найдена' });
//             }
//           })
//           .catch(() => {
//             res.status(400).send({ message: 'Переданы некорректные данные' });
//           });
//       }
//     })
//     .catch(() => {
//       res.status(500).send({ message: 'Ошибка 500' });
//     });
// };
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        res.status(404).send({ message: 'Недостаточно прав для удаления карточки' });
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Карточка не найдена' });
      } else {
        res.status(404).send({ message: 'Некорректно переданы данные' });
      }
    });
};

// поставить лайк
const putLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
      }
    });
};

// удалить лайк
const deleteLikes = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
        .then((card) => {
          if (card) {
            res.send(card);
          } else {
            res.status(404).send({ message: 'Карточка не найдена' });
          }
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'Переданы некорректные данные' });
          } else {
            res.status(500).send({ message: 'Ошибка 500' });
          }
        });
    })
    .catch(() => {
      res.status(400).send({ message: 'Лайк пользователя не найден' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
