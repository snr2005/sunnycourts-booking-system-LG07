const express = require('express');
const router = express.Router();

// GET /api/reservations
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all reservations placeholder' });
});

// GET /api/reservations/details (JOIN endpoint)
router.get('/details', (req, res) => {
  res.status(200).json({ message: 'Get reservations with details placeholder' });
});

// GET /api/reservations/:id
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get reservation ${req.params.id} placeholder` });
});

// POST /api/reservations
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create reservation placeholder' });
});

// DELETE /api/reservations/:id
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Cancel reservation ${req.params.id} placeholder` });
});

module.exports = router;
