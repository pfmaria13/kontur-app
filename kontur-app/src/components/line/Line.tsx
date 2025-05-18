import React, { useEffect, useRef } from 'react';

interface LineProps {
    word: string;
    status: string[];
    isActive: boolean;
    onEnter: (value: string) => void;
}

const Line: React.FC<LineProps> = ({ word, status, isActive }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive) {
            inputRef.current?.focus();
        }
    }, [isActive]);

    return (
        <div className="line" onClick={() => inputRef.current?.focus()}>
            {[0, 1, 2, 3, 4].map(i => (
                <div
                    key={i}
                    className={`square ${status[i] || ''} ${isActive && i === word.length ? 'active' : ''}`}
                >
                    {word[i] || ''}
                    {isActive && i === word.length && <div className="underline" />}
                </div>
            ))}
            {/* input нужен только для фокуса, не для отображения текста */}
            <input
                type="text"
                ref={inputRef}
                className="input-letter"
                value=""
                readOnly
            />
        </div>
    );
};

export default Line;