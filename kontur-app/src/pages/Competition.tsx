// src/pages/Competition.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Line from "../components/line/Line";
import ProgressDots from "../components/progress/ProgressDots";
import logo from "../img/logo-kontur.png";
import timeIcon from "../img/time.png";

interface WordResponse {
    word: string;
    length: number;
}

const MAX_ROUNDS = 5;
const MAX_TIME = 180; // сек

export default function Competition() {
    const navigate = useNavigate();
    const [lists, setLists] = useState<{
        all5: Set<string>;
        all6: Set<string>;
        it5: Set<string>;
        it6: Set<string>;
    } | null>(null);

    // Игра
    const [roundIndex, setRoundIndex] = useState(0);
    const [target, setTarget] = useState("");
    const [wordLength, setWordLength] = useState(5);
    const [lines, setLines] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[][]>([]);
    const [activeLine, setActiveLine] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [scores, setScores] = useState<number[]>([]);
    const warningRef = useRef<HTMLDivElement>(null);

    // 1) loading word lists (uppercase)
    useEffect(() => {
        async function loadWordLists() {
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
        loadWordLists();
    }, []);

    // 2) fetch new word each round
    useEffect(() => {
        if (!lists) return;
        fetch("http://localhost:3000/word")
            .then(r => r.json())
            .then((data: WordResponse) => {
                setTarget(data.word);                  // already UPPERCASE
                setWordLength(data.length);
            });
    }, [roundIndex, lists]);

    // 3) init round state
    useEffect(() => {
        if (!target) return;
        const maxAtt = wordLength === 6 ? 7 : 6;
        setLines(Array(maxAtt).fill(""));
        setStatuses(Array(maxAtt).fill([]));
        setActiveLine(0);
        setTimeElapsed(0);
        setStartTime(Date.now());
    }, [target, wordLength]);

    // 4) timer
    useEffect(() => {
        const id = setInterval(() => setTimeElapsed(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [roundIndex]);

    // scoring
    const calculateScore = (guessed: boolean, used: number, len: number, time: number) => {
        if (!guessed) return 0;
        const base = len === 5 ? 500 : 600;
        const attMax = len === 5 ? 6 : 7;
        const attBonus = 1 - (used - 1) / attMax;
        const timeBonus = 1 - Math.min(time, MAX_TIME) / MAX_TIME;
        return Math.round(base * attBonus + base * timeBonus);
    };

    // letter statuses
    const getStatuses = (guess: string, tgt: string) => {
        const res = Array(tgt.length).fill("absent");
        const used = Array(tgt.length).fill(false);
        for (let i = 0; i < tgt.length; i++) {
            if (guess[i] === tgt[i]) {
                res[i] = "correct"; used[i] = true;
            }
        }
        for (let i = 0; i < tgt.length; i++) {
            if (res[i] === "correct") continue;
            const idx = tgt.split("").findIndex((ch, j) => ch === guess[i] && !used[j]);
            if (idx !== -1) { res[i] = "present"; used[idx] = true; }
        }
        return res;
    };

    // onEnter
    const handleEnter = (guess: string) => {
        if (!lists) return;

        const upper = guess.toUpperCase();
        const inIt  = wordLength === 5 ? lists.it5.has(upper)  : lists.it6.has(upper);
        const inAll = wordLength === 5 ? lists.all5.has(upper) : lists.all6.has(upper);
        console.log("isInIt?", inIt, "isInAll?", inAll);

        console.group("handleEnter");
        console.log("Guess raw:", guess);
        console.log("upper:", upper);
        console.log("target:", target, "wordLength:", wordLength);
        console.log("lists.it5 size:", lists.it5.size, "first few:", Array.from(lists.it5).slice(0,10));
        console.log("lists.all5 size:", lists.all5.size, "first few:", Array.from(lists.all5).slice(0,10));
        console.groupEnd();


        if (!inIt && !inAll) {
            if (warningRef.current) {
                warningRef.current.textContent = "Слова нет в словаре, попробуйте другое";
                setTimeout(() => { warningRef.current!.textContent = ""; }, 2000);
            }
            return;
        }

        const newLines    = [...lines];
        const newStatuses = [...statuses];
        newLines[activeLine]    = upper;
        newStatuses[activeLine] = getStatuses(upper, target);
        setLines(newLines);
        setStatuses(newStatuses);

        const guessed = newStatuses[activeLine].every(s => s === "correct");
        const used    = activeLine + 1;
        const maxAtt  = wordLength === 6 ? 7 : 6;

        if (guessed || used === maxAtt) {
            const tTaken = Math.floor((Date.now() - startTime) / 1000);
            const roundScore = calculateScore(guessed, used, wordLength, tTaken);
            setScores(prev => [...prev, roundScore]);

            if (roundIndex + 1 < MAX_ROUNDS) {
                setRoundIndex(r => r + 1);
            } else {
                const total = [...scores, roundScore].reduce((a, b) => a + b, 0);
                const tg = localStorage.getItem("telegram") || "";
                fetch("http://localhost:3000/submit-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telegram: tg, score: total })
                }).then(() => navigate("/results"));
            }
        } else {
            setActiveLine(i => i + 1);
        }
    };

    if (!lists) return <div>Загрузка словаря...</div>;

    const fmtTime = (s: number) => {
        const m = Math.floor(s / 60), sec = s % 60;
        return `${m}:${sec < 10 ? "0"+sec : sec}`;
    };

    return (
        <div className="competition-container container">
            <div className="top">
                <img src={logo} className="logo" alt="Логотип" />
                <div className="right-top">
                    <div className="timer">
                        <img src={timeIcon} className="time-img" alt="" />
                        <span className="timer-text">{fmtTime(timeElapsed)}</span>
                    </div>
                </div>
            </div>

            <div className="game">
                <h1 className="competition-title">
                    Соревнование — раунд {roundIndex+1} из {MAX_ROUNDS}
                </h1>
                <ProgressDots activeCount={roundIndex+1} />
                <div ref={warningRef} className="warning-dict" />
                {lines.map((line, idx) => (
                    <Line
                        key={idx}
                        word={line}
                        status={statuses[idx]}
                        isActive={idx===activeLine}
                        onEnter={handleEnter}
                        length={wordLength}
                    />
                ))}
            </div>
        </div>
    );
}
