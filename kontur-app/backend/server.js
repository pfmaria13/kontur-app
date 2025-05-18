// server.js
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

        db.run(
            insertQuery,
            [lastName, firstName, patronymic, telegram, email, specialty, course, direction],
            function (err) {
                if (err) return res.status(500).json({ message: "Ошибка при добавлении пользователя" });
                return res.status(200).json({ message: "Регистрация успешна" });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
