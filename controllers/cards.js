const Card = require('../models/cards');

const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const FORBIDDEN_ERROR = require('../errors/forbiddenError');

// получить все карточки
const getCards = (req, res, next) => {
  Card.find()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

// создать новую карточку
const createCard = (req, res, next) => {
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
        next(new BAD_REQUEST_ERROR({ message }));
      } else {
        next(err);
      }
    });
};

// удалить карточку
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        next(new FORBIDDEN_ERROR('Недостаточно прав для удаления карточки'));
      } else {
        Card.findByIdAndDelete(req.params.cardId)
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Карточка не найдена'));
      } else {
        next(new NOT_FOUND_ERROR('Переданы некорректные данные'));
      }
    });
};

// поставить лайк
const putLikes = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Карточка не найдена');
      } else {
        res.send(card);
      }
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// удалить лайк
const deleteLikes = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Карточка не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Переданы некорректные данные'));
      } else {
        next(err);
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
