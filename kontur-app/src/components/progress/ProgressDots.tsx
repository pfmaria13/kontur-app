import React from 'react';

interface ProgressDotsProps {
    activeCount: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ activeCount }) => {
    return (
        <div className="progress-dots">
            {[0, 1, 2, 3, 4].map(i => (
                <span key={i} className={`dot ${i < activeCount ? 'active' : ''}`} />
            ))}
        </div>
    );
};

export default ProgressDots;
