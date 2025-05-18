import React, { useEffect, useRef } from 'react';

interface LineProps {
    word: string;
    status: string[];
    isActive: boolean;
    onEnter: (value: string) => void;
}

const Line: React.FC<LineProps> = ({ word, status, isActive, onEnter, length }) => {
    const [input, setInput] = useState("");
    const ref = useRef<HTMLInputElement>(null);
const Line: React.FC<LineProps> = ({ word, status, isActive }) => {
    const inputRef = useRef<HTMLInputElement>(null);

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
        <div className="line" onClick={() => inputRef.current?.focus()}>
            {[0, 1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className={`square ${status[i] || ''} ${isActive && i === word.length ? 'active' : ''}`}
                >
                    {word[i] || ''}
                    {isActive && i === word.length && <div className="underline" />}
        <div className="line" style={{ display: "grid", gridTemplateColumns: `repeat(${length},1fr)` }}
             onClick={() => ref.current?.focus()}>
            {Array.from({ length }).map((_, i) => (
                <div key={i}
                     className={`square ${status[i]||""} ${isActive && i===input.length ? "active":""}`}>
                    {disp[i]||""}
                    {isActive && i===input.length && <div className="underline"/>}
                </div>
            ))}
            {/* input нужен только для фокуса, не для отображения текста */}
            <input
                type="text"
                ref={inputRef}
                className="input-letter"
                value=""
                readOnly

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
