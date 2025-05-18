import React from 'react';
import { FaCheck, FaBackspace } from 'react-icons/fa';
import "./style.css"

type KeyType = string | 'enter' | 'backspace';

interface KeyboardProps {
    onKeyPress: (key: string) => void;
}

const rows: KeyType[][] = [
    ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ь'],
    ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
    ['enter', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'backspace'],
];

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
    return (
        <div className="keyboard-container">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key, keyIndex) => (
                        <button
                            key={keyIndex}
                            className={`key ${key === 'enter' || key === 'backspace' ? 'key-action' : ''}`}
                            onClick={() =>
                                onKeyPress(
                                    key === 'enter' ? 'ENTER' : key === 'backspace' ? 'BACKSPACE' : key
                                )
                            }
                        >
                            {key === 'enter' ? <FaCheck /> : key === 'backspace' ? <FaBackspace /> : key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard;
