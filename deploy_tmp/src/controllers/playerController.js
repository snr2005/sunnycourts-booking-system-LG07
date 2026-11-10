const db = require('../config/database');

// GET all players
exports.getAllPlayers = (req, res, next) => {
  try {
    const players = db.prepare('SELECT * FROM players').all();
    return res.status(200).json({ status: 'success', count: players.length, data: players });
  } catch (error) {
    next(error);
  }
};

// GET player by ID
exports.getPlayerById = (req, res, next) => {
  try {
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
    if (!player) {
      return res.status(404).json({ error: `Player with ID ${req.params.id} not found` });
    }
    return res.status(200).json({ status: 'success', data: player });
  } catch (error) {
    next(error);
  }
};

// CREATE player
exports.createPlayer = (req, res, next) => {
  try {
    const { name, email } = req.body;
    const stmt = db.prepare('INSERT INTO players (name, email) VALUES (?, ?)');
    const result = stmt.run(name, email);
    const newPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ status: 'success', message: 'Player created successfully', data: newPlayer });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    next(error);
  }
};
