const express = require('express');
const router = express.Router();
const { addFavorite, getFavoriteByUserId, removeFromFavorites } = require('../controllers/favoriteController');

router.post('/add_to_favorite', addFavorite);
router.get('/:userId', getFavoriteByUserId);
router.delete('/remove', removeFromFavorites);

module.exports = router;