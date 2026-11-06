const db = require('../config/database');

// GET all courts (supports query param search by sport)
exports.getAllCourts = (req, res, next) => {
  try {
    const { sport } = req.query;
    let query = 'SELECT * FROM courts';
    const params = [];

    if (sport) {
      query += ' WHERE LOWER(sport) = LOWER(?)';
      params.push(sport);
    }

    const courts = db.prepare(query).all(...params);
    return res.status(200).json({ status: 'success', count: courts.length, data: courts });
  } catch (error) {
    next(error);
  }
};

// GET court by ID
exports.getCourtById = (req, res, next) => {
  try {
    const court = db.prepare('SELECT * FROM courts WHERE id = ?').get(req.params.id);
    if (!court) {
      return res.status(404).json({ error: `Court with ID ${req.params.id} not found` });
    }
    return res.status(200).json({ status: 'success', data: court });
  } catch (error) {
    next(error);
  }
};

// CREATE new court
exports.createCourt = (req, res, next) => {
  try {
    const { name, sport } = req.body;
    const stmt = db.prepare('INSERT INTO courts (name, sport) VALUES (?, ?)');
    const result = stmt.run(name, sport);
    const newCourt = db.prepare('SELECT * FROM courts WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ status: 'success', message: 'Court created successfully', data: newCourt });
  } catch (error) {
    next(error);
  }
};

// UPDATE court by ID
exports.updateCourt = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM courts WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: `Court with ID ${req.params.id} not found` });
    }

    const name = req.body.name || existing.name;
    const sport = req.body.sport || existing.sport;

    db.prepare('UPDATE courts SET name = ?, sport = ? WHERE id = ?').run(name, sport, req.params.id);
    const updated = db.prepare('SELECT * FROM courts WHERE id = ?').get(req.params.id);
    return res.status(200).json({ status: 'success', message: 'Court updated successfully', data: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE court by ID
exports.deleteCourt = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM courts WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: `Court with ID ${req.params.id} not found` });
    }

    db.prepare('DELETE FROM courts WHERE id = ?').run(req.params.id);
    return res.status(200).json({ status: 'success', message: `Court ${req.params.id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
