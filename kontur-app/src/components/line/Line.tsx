import React, { useEffect, useRef } from "react";

interface LineProps {
    word: string;            // отображаемое слово (частично или целиком)
    status: string[];        // статусы клеток: "correct"|"present"|"absent"
    isActive: boolean;       // активный ряд?
    onEnter: (value: string) => void;
    length: number;          // сколько клеток показываем
}

const Line: React.FC<LineProps> = ({
                                       word,
                                       status,
                                       isActive,
                                       onEnter,
                                       length,
                                   }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isActive) inputRef.current?.focus();
    }, [isActive]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && word.length === length) {
            onEnter(word);
        }
    };

    return (
        <div
            className="line"
            style={{ display: "grid", gridTemplateColumns: `repeat(${length},1fr)` }}
            onClick={() => inputRef.current?.focus()}
        >
            {Array.from({ length }).map((_, i) => (
                <div
                    key={i}
                    className={`square ${status[i] || ""} ${
                        isActive && i === word.length ? "active" : ""
                    }`}
                >
                    {word[i] || ""}
                    {isActive && i === word.length && <div className="underline" />}
                </div>
            ))}

            <input
                ref={inputRef}
                className="input-letter"
                style={{ opacity: 0, position: "absolute" }}
                onKeyDown={handleKey}
                value=""
                readOnly
            />
        </div>
    );
};

export default Line;
