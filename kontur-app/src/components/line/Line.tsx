import React, { useEffect, useRef, useState } from 'react';

interface LineProps {
    word: string;
    status: string[];
    isActive: boolean;
    onEnter: (value: string) => void;
}

const Line: React.FC<LineProps> = ({ word, status, isActive, onEnter }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive) {
            inputRef.current?.focus();
        }
    }, [isActive]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key.toUpperCase();

        if (key === 'BACKSPACE') {
            setInput(prev => prev.slice(0, -1));
        } else if (key === 'ENTER') {
            onEnter(input);
        } else if (/^[А-ЯЁ]$/.test(key) && input.length < 5) {
            setInput(prev => prev + key);
        }
    };

    const displayWord = isActive ? input : word;

    return (
        <div className="line" onClick={() => inputRef.current?.focus()}>
            {[0, 1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className={`square ${status[i] || ''} ${isActive && i === input.length ? 'active' : ''}`}
                >
                    {displayWord[i] || ''}
                    {isActive && i === input.length && <div className="underline" />}
                </div>
            ))}
            <input
                type="text"
                ref={inputRef}
                className="input-letter"
                onKeyDown={handleKeyDown}
                value=""
            />
        </div>
    );
};

export default Line;
