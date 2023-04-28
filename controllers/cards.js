const Card = require('../models/cards');

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
  const card = {
    name,
    link,
    owner: req.user._id,
  };
  Card.create(card)
    .then(() => res.status(201).send({ data: card }))
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
    .catch(() => {
      res.status(500).send({ message: 'Ошибка 500' });
    });
};

// поставить лайк
const putLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
      }
    });
};

// удалить лайк
const deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка 500' });
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
