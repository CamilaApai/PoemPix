const express = require('express');
const router = express.Router();

const { isAuthenticated } = require("../middleware/authenticate");

const favoritesController = require('../controllers/favorites');

router.get('/', favoritesController.getAllFavoritePoems);
router.get('/:id', favoritesController.getFavoritePoem);
router.post('/', isAuthenticated, favoritesController.addFavoritePoem);
router.put('/:id', isAuthenticated, favoritesController.updateFavorite);
router.delete('/:id', isAuthenticated, favoritesController.deleteFavorite);

module.exports = router;
