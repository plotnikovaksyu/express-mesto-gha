const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  putLikes,
  deleteLikes,
} = require('../controllers/cards');

const cardsRoter = express.Router();

cardsRoter.get('/cards', getCards);
cardsRoter.post('/cards', createCard);
cardsRoter.delete('/cards/:cardId', deleteCard);
cardsRoter.put('/cards/:cardId/likes', putLikes);
cardsRoter.delete('/cards/:cardId/likes', deleteLikes);

module.exports = { cardsRoter };
