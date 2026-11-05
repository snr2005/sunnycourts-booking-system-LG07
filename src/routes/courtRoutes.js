const express = require('express');
const router = express.Router();

// GET /api/courts
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all courts route placeholder' });
});

// GET /api/courts/:id
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get court ${req.params.id} placeholder` });
});

// POST /api/courts
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create court placeholder' });
});

// PUT /api/courts/:id
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update court ${req.params.id} placeholder` });
});

// DELETE /api/courts/:id
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete court ${req.params.id} placeholder` });
});

module.exports = router;
