import React from 'react';

const ControlPanel = ({ togglePlay, isPlaying }) => {
  return (
    <div className="p-4">
      <button
        className={`${
          isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold py-2 px-4 rounded`}
        onClick={togglePlay}
      >
        {isPlaying ? 'Stop' : 'Play'}
      </button>
    </div>
  );
};

export default ControlPanel;
