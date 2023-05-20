const Card = require('../models/cards');

const NOT_FOUND_ERROR = 404;
const BAD_REQUEST_ERROR = 400;
const DEFAULT_ERROR = 500;

// получить все карточки
const getCards = (req, res) => {
  Card.find()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
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
      if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(BAD_REQUEST_ERROR).send({ message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

// удалить карточку
// const deleteCard = (req, res) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (card) {
//         if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
//           res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
//         }
//       } else {
//         Card.findByIdAndDelete(req.params.cardId)
//           .then((deletedCard) => {
//             res.status(200).send(deletedCard);
//           });
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректно переданы данные' });
//       } else {
//         res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
//       }
//     });
// };

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Недостаточно прав для удаления карточки' });
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Карточка не найдена' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
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
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

// удалить лайк
const deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
};
