import React from 'react';

interface ProgressDotsProps {
    activeCount: number;
}

const ProgressDotsPlot: React.FC<ProgressDotsProps> = ({ activeCount }) => {
    return (
        <div className="progress-dots">
            {[0, 1, 2].map(i => (
                <span key={i} className={`dot ${i < activeCount ? 'active' : ''}`} />
            ))}
        </div>
    );
};

export default ProgressDotsPlot;
