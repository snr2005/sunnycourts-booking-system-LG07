const db = require('../config/database');

// GET all reservations
exports.getAllReservations = (req, res, next) => {
  try {
    const reservations = db.prepare('SELECT * FROM reservations').all();
    return res.status(200).json({ status: 'success', count: reservations.length, data: reservations });
  } catch (error) {
    next(error);
  }
};

// GET reservations with JOIN (Reservation + Player Name + Court Name)
exports.getReservationsWithDetails = (req, res, next) => {
  try {
    const query = `
      SELECT 
        r.id AS reservation_id,
        r.slot_time,
        r.status,
        r.created_at,
        p.id AS player_id,
        p.name AS player_name,
        p.email AS player_email,
        c.id AS court_id,
        c.name AS court_name,
        c.sport AS court_sport
      FROM reservations r
      JOIN players p ON r.player_id = p.id
      JOIN courts c ON r.court_id = c.id
      ORDER BY r.id ASC
    `;
    const details = db.prepare(query).all();
    return res.status(200).json({ status: 'success', count: details.length, data: details });
  } catch (error) {
    next(error);
  }
};

// GET reservation by ID
exports.getReservationById = (req, res, next) => {
  try {
    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: `Reservation with ID ${req.params.id} not found` });
    }
    return res.status(200).json({ status: 'success', data: reservation });
  } catch (error) {
    next(error);
  }
};

// CREATE reservation (base CRUD - validation/twist layer will enhance this)
exports.createReservation = (req, res, next) => {
  try {
    const { player_id, court_id, slot_time } = req.body;
    const stmt = db.prepare(`
      INSERT INTO reservations (player_id, court_id, slot_time, status)
      VALUES (?, ?, ?, 'active')
    `);
    const result = stmt.run(player_id, court_id, slot_time);
    const newReservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ status: 'success', message: 'Reservation created successfully', data: newReservation });
  } catch (error) {
    next(error);
  }
};

// DELETE / Cancel reservation
exports.deleteReservation = (req, res, next) => {
  try {
    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: `Reservation with ID ${req.params.id} not found` });
    }

    // Either delete or mark cancelled. Here we support removing/cancelling it
    db.prepare('DELETE FROM reservations WHERE id = ?').run(req.params.id);
    return res.status(200).json({ status: 'success', message: `Reservation ${req.params.id} cancelled/freed successfully` });
  } catch (error) {
    next(error);
  }
};
