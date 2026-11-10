const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { validateCourt } = require('../middleware/validation');

// Court endpoints
router.get('/', courtController.getAllCourts);
router.get('/:id', courtController.getCourtById);
router.post('/', validateCourt, courtController.createCourt);
router.put('/:id', validateCourt, courtController.updateCourt);
router.delete('/:id', courtController.deleteCourt);

module.exports = router;
