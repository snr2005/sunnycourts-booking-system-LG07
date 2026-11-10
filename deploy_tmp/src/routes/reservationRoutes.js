const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { validateReservation } = require('../middleware/validation');

// JOIN endpoint: reservations with player name and court name
router.get('/details', reservationController.getReservationsWithDetails);

// Reservation CRUD
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.post('/', validateReservation, reservationController.createReservation);
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
