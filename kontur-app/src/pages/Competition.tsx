// src/pages/Competition.tsx
import React, { useState, useEffect, useRef } from "react";
import Line from "../components/line/Line";
import ProgressDots from "../components/progress/ProgressDots";
import logo from "../img/logo-kontur.png";
import timeIcon from "../img/time.png";
import { NavLink, useNavigate } from "react-router-dom";
import Keyboard from "../components/keyboard/Keyboard";

interface WordResponse {
    word: string;
    length: number;
}
interface WordLists {
    all5: Set<string>;
    all6: Set<string>;
    it5: Set<string>;
    it6: Set<string>;
}

const MAX_ROUNDS = 5;
const MAX_TIME = 180; // сек

const Competition: React.FC = () => {
    const navigate = useNavigate();

    // словари
    const [lists, setLists] = useState<WordLists | null>(null);

    // раунд и текущее загаданное слово
    const [round, setRound] = useState(0);
    const [target, setTarget] = useState("");
    const [wordLength, setWordLength] = useState(5);

    // доска
    const maxAttempts = wordLength === 6 ? 7 : 6;
    const [lines, setLines] = useState<string[]>(Array(maxAttempts).fill(""));
    const [statuses, setStatuses] = useState<string[][]>(Array(maxAttempts).fill([]));
    const [activeLine, setActiveLine] = useState(0);
    const [currentInput, setCurrentInput] = useState("");

    // таймер
    const [timeStart, setTimeStart] = useState(Date.now());
    const [timeElapsed, setTimeElapsed] = useState(0);

    // очки
    const [roundScores, setRoundScores] = useState<number[]>([]);
    const [roundSuccesses, setRoundSuccesses] = useState<boolean[]>([]);

    const warningRef = useRef<HTMLDivElement>(null);

    // 1) Загрузить словари один раз
    useEffect(() => {
        async function load() {
            const [a5, a6, i5, i6] = await Promise.all([
                fetch("/all_5.txt").then(r => r.text()),
                fetch("/all_6.txt").then(r => r.text()),
                fetch("/it_5.txt").then(r => r.text()),
                fetch("/it_6.txt").then(r => r.text()),
            ]);
            setLists({
                all5: new Set(a5.split(/\r?\n/).map(w => w.trim().toUpperCase()).filter(Boolean)),
                all6: new Set(a6.split(/\r?\n/).map(w => w.trim().toUpperCase()).filter(Boolean)),
                it5:  new Set(i5.split(/\r?\n/).map(w => w.trim().toUpperCase()).filter(Boolean)),
                it6:  new Set(i6.split(/\r?\n/).map(w => w.trim().toUpperCase()).filter(Boolean)),
            });
        }
        load();
    }, []);

    // 2) На каждый раунд — запросить новое слово и инициализировать
    useEffect(() => {
        if (!lists) return;
        fetch("http://localhost:3000/word")
            .then(r => r.json())
            .then((data: WordResponse) => {
                const w = data.word.toUpperCase();
                setTarget(w);
                setWordLength(data.length);

                const attempts = data.length === 6 ? 7 : 6;
                setLines(Array(attempts).fill(""));
                setStatuses(Array(attempts).fill([]));
                setActiveLine(0);
                setCurrentInput("");
                setTimeStart(Date.now());
                setTimeElapsed(0);
            });
    }, [lists, round]);

    // 3) Таймер
    useEffect(() => {
        const id = setInterval(
            () => setTimeElapsed(Math.floor((Date.now() - timeStart) / 1000)),
            500
        );
        return () => clearInterval(id);
    }, [timeStart]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" + secs : secs}`;
    };

    // проверка статусов букв
    function getStatuses(guess: string, tgt: string): string[] {
        const res = Array(tgt.length).fill("absent");
        const used = Array(tgt.length).fill(false);
        for (let i = 0; i < tgt.length; i++) {
            if (guess[i] === tgt[i]) {
                res[i] = "correct";
                used[i] = true;
            }
        }
        for (let i = 0; i < tgt.length; i++) {
            if (res[i] === "correct") continue;
            const idx = tgt.split("").findIndex((ch, j) => ch === guess[i] && !used[j]);
            if (idx !== -1) {
                res[i] = "present";
                used[idx] = true;
            }
        }
        return res;
    }

    // расчёт очков за раунд
    function calcScore(guessed: boolean, used: number, len: number, t: number): number {
        if (!guessed) return 0;
        const base = len * 100;
        const attemptBonus = 1 - (used - 1) / (len === 5 ? 6 : 7);
        const timeBonus = 1 - Math.min(t, MAX_TIME) / MAX_TIME;
        return Math.round(base * attemptBonus + base * timeBonus);
    }

    // ввод слова
    const handleEnter = (value: string) => {
        if (!lists) return;
        const upper = value.toUpperCase();

        // **Проверка по словарям**
        const itSet  = wordLength === 5 ? lists.it5  : lists.it6;
        const allSet = wordLength === 5 ? lists.all5 : lists.all6;
        const inIt  = itSet.has(upper);
        const inAll = allSet.has(upper);

        if (!inIt && !inAll) {
            // слово не в словаре — предупреждаем, попытка не списывается
            if (warningRef.current) {
                warningRef.current.textContent = "Нет такого слова";
                setTimeout(() => (warningRef.current!.textContent = ""), 2000);
            }
            return;
        }

        // слово валидно — списываем попытку
        const sts = getStatuses(upper, target);
        const newLines = [...lines];    newLines[activeLine] = upper;
        const newStats = [...statuses]; newStats[activeLine] = sts;
        setLines(newLines);
        setStatuses(newStats);

        const guessed = sts.every(s => s === "correct");
        const used = activeLine + 1;
        const score = calcScore(guessed, used, wordLength, timeElapsed);
        setRoundScores(prev => [...prev, score]);
        setRoundSuccesses(prev => [...prev, guessed]);

        // если угадали или исчерпали попытки — следующий раунд / финал
        if (guessed || used === maxAttempts) {
            if (round + 1 < MAX_ROUNDS) {
                setRound(r => r + 1);
            } else {
                // последний раунд — сохраняем и уходим на результаты
                const total = [...roundScores, score].reduce((a, b) => a + b, 0);
                const tg = localStorage.getItem("telegram")!;
                fetch("http://localhost:3000/submit-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegram: tg, score: total }),
                }).then(() => navigate("/rating"));
            }
        } else {
            // ещё остались попытки в этом раунде
            setActiveLine(i => i + 1);
            setCurrentInput("");
        }
    };

    // клавиши
    const handleKeyPress = (key: string) => {
        if (key === "ENTER") {
            handleEnter(currentInput);
        } else if (key === "BACKSPACE") {
            setCurrentInput(prev => prev.slice(0, -1));
        } else if (/^[А-ЯЁ]$/i.test(key) && currentInput.length < wordLength) {
            setCurrentInput(prev => prev + key.toUpperCase());
        }
    };

    const guessedCount = roundSuccesses.filter(Boolean).length;
    const activeDots = Math.min(guessedCount + 1, MAX_ROUNDS);

    if (!lists) return <div>Загрузка словаря...</div>;

    return (
        <div className="competition-container container">
            <div className="top">
                <img src={logo} alt="Логотип" className="logo" />
                <div className="right-top">
                    <div className="timer">
                        <img src={timeIcon} alt="" className="time-img" />
                        <span className="timer-text">{formatTime(timeElapsed)}</span>
                    </div>
                    <NavLink to="/rules">
                        <p className="rules-btn">?</p>
                    </NavLink>
                </div>
            </div>

            <div className="game">
                <h1 className="competition-title">Соревнование</h1>
                <ProgressDots activeCount={activeDots} />
                <div ref={warningRef} className="warning-dict" />
                {lines.map((line, idx) => (
                    <Line
                        key={idx}
                        word={idx === activeLine ? currentInput : line}
                        status={statuses[idx]}
                        isActive={idx === activeLine}
                        onEnter={handleEnter}
                        length={wordLength}
                    />
                ))}
            </div>
            <Keyboard onKeyPress={handleKeyPress} />
        </div>
    );
};

export default Competition;
