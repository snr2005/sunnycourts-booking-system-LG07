const express = require('express');
const router = express.Router();

// GET /api/players
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all players route placeholder' });
});

// GET /api/players/:id
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get player ${req.params.id} placeholder` });
});

// POST /api/players
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create player placeholder' });
});

module.exports = router;
