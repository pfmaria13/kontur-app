import React, { useState } from "react";
import Line from "../components/line/Line";
import ProgressDotsPlot from "../components/progress/ProgressDotsPlot.tsx";
import logo from "../img/logo-kontur.png";
import time from "../img/time.png";

const TARGET_WORD = 'АДМИН';

const Plot = () => {
    const [lines, setLines] = useState<string[]>(Array(5).fill(''));
    const [statuses, setStatuses] = useState<(string[])[]>(Array(5).fill([]));
    const [activeLine, setActiveLine] = useState(0);

    const handleEnter = (value: string) => {
        if (value.length !== 5) return;
        const result = getStatuses(value, TARGET_WORD);
        const newLines = [...lines];
        const newStatuses = [...statuses];
        newLines[activeLine] = value;
        newStatuses[activeLine] = result;
        setLines(newLines);
        setStatuses(newStatuses);
        if (activeLine < 4) setActiveLine(activeLine + 1);
    };

    const guessedWords = statuses.filter(s => s.length === 5 && s.every(ch => ch === 'correct')).length;
    const activeDots = Math.min(guessedWords + 1, 5);

    return (
        <div className="competition-container container">
            <div className="top">
                <img src={logo} alt="Логотип" className="logo" />
                <div className="right-top">
                    <p className="rules-btn">?</p>
                </div>
            </div>

            <div className="game">
                <h1 className="competition-title">Соревнование</h1>
                <ProgressDotsPlot activeCount={activeDots} />
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        word={line}
                        status={statuses[index]}
                        isActive={index === activeLine}
                        onEnter={handleEnter}
                    />
                ))}
            </div>
        </div>
    );
};

export default Plot;

function getStatuses(guess: string, target: string): string[] {
    const result = Array(5).fill('absent');
    const targetArr = target.split('');
    const used = Array(5).fill(false);

    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'correct';
            used[i] = true;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i] === 'correct') continue;
        const idx = targetArr.findIndex((ch, j) => ch === guess[i] && !used[j]);
        if (idx !== -1) {
            result[i] = 'present';
            used[idx] = true;
        }
    }

    return result;
}