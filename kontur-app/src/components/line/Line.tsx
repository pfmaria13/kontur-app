// src/components/line/Line.tsx
import React, { useEffect, useRef, useState } from 'react';

interface LineProps {
    word: string;         // UPPERCASE
    status: string[];     // ['correct'|'present'|'absent']
    isActive: boolean;
    onEnter: (value: string) => void;
    length: number;       // 5 или 6
}

const Line: React.FC<LineProps> = ({ word, status, isActive, onEnter, length }) => {
    const [input, setInput] = useState("");
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive) ref.current?.focus();
    }, [isActive]);

    const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const k = e.key.toUpperCase();
        if (k === "BACKSPACE") {
            setInput(prev => prev.slice(0, -1));
        } else if (k === "ENTER") {
            if (input.length === length) {
                onEnter(input);
                setInput("");
            }
        } else if (/^[А-ЯЁ]$/.test(k) && input.length < length) {
            setInput(prev => prev + k);
        }
    };

    const disp = isActive ? input : word;

    return (
        <div className="line" style={{ display: "grid", gridTemplateColumns: `repeat(${length},1fr)` }}
             onClick={() => ref.current?.focus()}>
            {Array.from({ length }).map((_, i) => (
                <div key={i}
                     className={`square ${status[i]||""} ${isActive && i===input.length ? "active":""}`}>
                    {disp[i]||""}
                    {isActive && i===input.length && <div className="underline"/>}
                </div>
            ))}

            <input ref={ref}
                   className="input-letter"
                   style={{ opacity:0, position:"absolute" }}
                   onKeyDown={onKey}
                   value=""
            />
        </div>
    );
};

export default Line;
