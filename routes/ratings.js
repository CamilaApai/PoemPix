const express = require('express');
const router = express.Router();

const { isAuthenticated } = require("../middleware/authenticate");

const ratingsController = require('../controllers/ratings');

router.get('/', ratingsController.getAllRatings);
router.get('/:id', ratingsController.getSingleRating);
router.put('/:id', isAuthenticated, ratingsController.updateRating);
router.delete('/:id', isAuthenticated, ratingsController.deleteRating);

module.exports = router;
