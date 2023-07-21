const express = require('express');
const router = express.Router();

const { isAuthenticated } = require("../middleware/authenticate");

const poemsController = require('../controllers/poems');

router.get('/', poemsController.getAllPoems);
router.get('/:id', poemsController.getPoemById);
router.post('/', isAuthenticated, poemsController.createPoem);
router.put('/:id', isAuthenticated, poemsController.updatePoem);
router.delete('/:id', isAuthenticated, poemsController.deletePoem);

module.exports = router;
