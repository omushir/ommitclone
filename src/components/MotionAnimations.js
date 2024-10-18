import React from 'react';

const MotionAnimations = ({ onMove, onTurn, onGoTo }) => {
    return (
        <div className="motion-animations">
            <button onClick={() => onMove(10)}>Move 10 Steps</button>
            <button onClick={() => onTurn(90)}>Turn 90 Degrees</button>
            <button onClick={() => onGoTo(100, 100)}>Go to x: 100 y: 100</button>
        </div>
    );
};

export default MotionAnimations;