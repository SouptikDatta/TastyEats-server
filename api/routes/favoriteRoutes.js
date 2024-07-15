const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const verifyToken = require('../middleware/verifyToken');

// GET all favorite items for a user
router.get('/', verifyToken, favoriteController.getAllFavorites); 

// ADD a new favorite item
router.post('/', verifyToken, favoriteController.addFavorite);

// REMOVE a favorite item
router.delete('/:id', verifyToken, favoriteController.removeFavorite);


module.exports = router;