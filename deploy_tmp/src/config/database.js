const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../sunnycourts.db');
const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

function initDb() {
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../database/seed.sql');

  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  // Check if players table already populated
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM players').get();
  if (rowCount.count === 0) {
    const seed = fs.readFileSync(seedPath, 'utf8');
    db.exec(seed);
  }
}

initDb();

module.exports = db;
