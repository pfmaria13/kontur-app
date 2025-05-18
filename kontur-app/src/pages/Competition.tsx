import React, { useState, useEffect } from "react";
import Line from "../components/line/Line";
import ProgressDots from "../components/progress/ProgressDots.tsx";
import logo from "../img/logo-kontur.png";
import time from "../img/time.png";
import {NavLink} from "react-router-dom";
import Keyboard from "../components/keyboard/Keyboard.tsx";

const TARGET_WORD = 'АДМИН';

const Competition = () => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [lines, setLines] = useState<string[]>(Array(5).fill(''));
    const [statuses, setStatuses] = useState<(string[])[]>(Array(5).fill([]));
    const [activeLine, setActiveLine] = useState(0);
    const [currentInput, setCurrentInput] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' + secs : secs}`;
    };

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

    const handleKeyPress = (key: string) => {
        if (key === 'ENTER') {
            if (currentInput.length === 5) {
                handleEnter(currentInput);
                setCurrentInput('');
            }
            return;
        }

        if (key === 'BACKSPACE') {
            setCurrentInput(prev => prev.slice(0, -1));
            return;
        }

        if (currentInput.length < 5 && /^[А-ЯЁ]$/i.test(key)) {
            setCurrentInput(prev => prev + key);
        }
    };

    return (
        <div className="competition-container container">
            <div className="top">
                <img src={logo} alt="Логотип" className="logo" />
                <div className="right-top">
                    <div className="timer">
                        <img src={time} alt="" className="time-img" />
                        <span className="timer-text">{formatTime(timeElapsed)}</span>
                    </div>
                    <NavLink to="/rules"><p className="rules-btn">?</p></NavLink>
                </div>
            </div>

            <div className="game">
                <h1 className="competition-title">Соревнование</h1>
                <ProgressDots activeCount={activeDots} />
                {lines.map((line, index) => (
                    <Line
                        key={index}
                        word={index === activeLine ? currentInput : line}
                        status={statuses[index]}
                        isActive={index === activeLine}
                        onEnter={handleEnter}
                    />
                ))}
            </div>
            <Keyboard onKeyPress={handleKeyPress} />
        </div>
    );
};

export default Competition;

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