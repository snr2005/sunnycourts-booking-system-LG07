const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { validatePlayer } = require('../middleware/validation');

// Player endpoints
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.post('/', validatePlayer, playerController.createPlayer);

module.exports = router;
