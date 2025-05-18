const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             lastName TEXT NOT NULL,
                                             firstName TEXT NOT NULL,
                                             patronymic TEXT,
                                             telegram TEXT UNIQUE NOT NULL,
                                             email TEXT UNIQUE NOT NULL,
                                             specialty TEXT NOT NULL,
                                             course TEXT NOT NULL,
                                             direction TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            date TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
});

module.exports = db;
