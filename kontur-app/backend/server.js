const express = require("express");
const cors = require("cors");
const fs = require("fs");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function loadFile(path) {
    return fs
        .readFileSync(path, "utf-8")
        .split(/\r?\n/)
        .map(w => w.trim().toUpperCase())
        .filter(Boolean);
}

const words = {
    all_5: loadFile("all_5.txt"),
    all_6: loadFile("all_6.txt"),
    it_5:  loadFile("it_5.txt"),
    it_6:  loadFile("it_6.txt"),
};

function getRandomWord() {
    const len = Math.random() < 0.5 ? 5 : 6;
    const pool = len === 5 ? words.it_5 : words.it_6;
    const word = pool[Math.floor(Math.random() * pool.length)];
    return { word, length: len };
}

// Регистрация
app.post("/register", (req, res) => {
    const {
        lastName, firstName, patronymic, telegram,
        email, specialty, course, direction
    } = req.body;

    const checkQuery = `SELECT * FROM users WHERE telegram = ? OR email = ?`;
    db.get(checkQuery, [telegram, email], (err, row) => {
        if (err) return res.status(500).json({ message: "Ошибка базы данных" });
        if (row) return res.status(400).json({ message: "Пользователь уже зарегистрирован" });

        const insertQuery = `
            INSERT INTO users (lastName, firstName, patronymic, telegram, email, specialty, course, direction)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertQuery,
            [lastName, firstName, patronymic, telegram, email, specialty, course, direction],
            function (err) {
                if (err) return res.status(500).json({ message: "Ошибка при добавлении пользователя" });
                return res.status(200).json({ message: "Регистрация успешна" });
            }
        );
    });
});

// Получение нового слова
app.get("/word", (req, res) => {
    const { word, length } = getRandomWord();
    res.json({ word, length });
});

// Сохранение результата
app.post("/submit-score", (req, res) => {
    const { telegram, score } = req.body;

    const findUser = `SELECT id FROM users WHERE telegram = ?`;
    db.get(findUser, [telegram], (err, row) => {
        if (err || !row) return res.status(400).json({ message: "Пользователь не найден" });

        const insertScore = `INSERT INTO leaderboard (user_id, score) VALUES (?, ?)`;
        db.run(insertScore, [row.id, score], function (err) {
            if (err) return res.status(500).json({ message: "Ошибка при сохранении" });
            res.status(200).json({ message: "Результат сохранён" });
        });
    });
});

// Получение топа
app.get("/leaderboard", (req, res) => {
    const { telegram } = req.query;

    const queryTop = `
        SELECT u.firstName, u.lastName, l.score
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.score DESC
        LIMIT 10
    `;

    const userRank = `
        SELECT u.firstName, u.lastName, l.score,
            (SELECT COUNT(*) + 1 FROM leaderboard l2 WHERE l2.score > l.score) AS place
        FROM leaderboard l
        JOIN users u ON l.user_id = u.id
        WHERE u.telegram = ?
        ORDER BY l.id DESC
        LIMIT 1
    `;

    db.all(queryTop, [], (err, topRows) => {
        if (err) return res.status(500).json({ message: "Ошибка получения топа" });

        db.get(userRank, [telegram], (err, userRow) => {
            if (err) return res.status(500).json({ message: "Ошибка получения ранга пользователя" });
            res.json({ top: topRows, user: userRow });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
