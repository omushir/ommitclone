// Import React library
import React from 'react';

// ControlPanel component definition
const ControlPanel = ({ togglePlay, isPlaying }) => {
  return (
    // Container div with padding
    <div className="p-4">
      {/* Play/Stop button */}
      <button
        // Dynamic class based on isPlaying state
        className={`${
          isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold py-2 px-4 rounded`}
        // Click handler to toggle play state
        onClick={togglePlay}
      >
        {/* Button text changes based on isPlaying state */}
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

// Export the ControlPanel component
export default ControlPanel;
