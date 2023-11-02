const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('consultorio.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS agendamentos(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT,
    patient TEXT,
    doctor TEXT,
    status TEXT
  )`);
});

module.exports = db;
