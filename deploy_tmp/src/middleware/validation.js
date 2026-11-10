const db = require('../config/database');

/**
 * Validates Court payload for creation and updates
 */
function validateCourt(req, res, next) {
  const isPost = req.method === 'POST';
  const { name, sport } = req.body;

  if (isPost) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Validation Error: "name" is required and cannot be empty.' });
    }
    if (!sport || typeof sport !== 'string' || sport.trim() === '') {
      return res.status(400).json({ error: 'Validation Error: "sport" is required and cannot be empty.' });
    }
  } else {
    // For PUT, at least one property must be provided
    if (name === undefined && sport === undefined) {
      return res.status(400).json({ error: 'Validation Error: At least "name" or "sport" must be provided for update.' });
    }
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'Validation Error: "name" cannot be empty.' });
    }
    if (sport !== undefined && (typeof sport !== 'string' || sport.trim() === '')) {
      return res.status(400).json({ error: 'Validation Error: "sport" cannot be empty.' });
    }
  }

  next();
}

/**
 * Validates Player payload
 */
function validatePlayer(req, res, next) {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: "name" is required.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Validation Error: A valid "email" is required.' });
  }

  next();
}

/**
 * Validates Reservation payload and enforces the Twist:
 * "A player can hold at most 3 active reservations. The 4th attempt gets 409 and the message 'Limit of 3 reached'. Returning one frees a place."
 */
function validateReservation(req, res, next) {
  const { player_id, court_id, slot_time } = req.body;

  if (!player_id) {
    return res.status(400).json({ error: 'Validation Error: "player_id" is required.' });
  }
  if (!court_id) {
    return res.status(400).json({ error: 'Validation Error: "court_id" is required.' });
  }
  if (!slot_time || typeof slot_time !== 'string' || slot_time.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: "slot_time" is required.' });
  }

  // Verify Player exists
  const player = db.prepare('SELECT * FROM players WHERE id = ?').get(player_id);
  if (!player) {
    return res.status(404).json({ error: `Player with ID ${player_id} does not exist.` });
  }

  // Verify Court exists
  const court = db.prepare('SELECT * FROM courts WHERE id = ?').get(court_id);
  if (!court) {
    return res.status(404).json({ error: `Court with ID ${court_id} does not exist.` });
  }

  // Twist Rule Check: Count current active reservations for this player
  const activeCount = db.prepare(
    "SELECT COUNT(*) AS count FROM reservations WHERE player_id = ? AND status = 'active'"
  ).get(player_id);

  if (activeCount.count >= 3) {
    return res.status(409).json({ message: 'Limit of 3 reached' });
  }

  next();
}

module.exports = {
  validateCourt,
  validatePlayer,
  validateReservation
};
