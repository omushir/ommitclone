// Import React library
import React from 'react';

// MotionAnimations component definition
const MotionAnimations = ({ onMove, onTurn, onGoTo }) => {
    return (
        // Container for motion animation buttons
        <div className="motion-animations">
            {/* Button to move 10 steps */}
            <button onClick={() => onMove(10)}>Move 10 Steps</button>
            {/* Button to turn 90 degrees */}
            <button onClick={() => onTurn(90)}>Turn 90 Degrees</button>
            {/* Button to go to specific coordinates */}
            <button onClick={() => onGoTo(100, 100)}>Go to x: 100 y: 100</button>
        </div>
    );
};

// Export the MotionAnimations component
export default MotionAnimations;