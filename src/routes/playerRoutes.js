const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Player endpoints
router.get('/', playerController.getAllPlayers);
router.get('/:id', playerController.getPlayerById);
router.post('/', playerController.createPlayer);

module.exports = router;
