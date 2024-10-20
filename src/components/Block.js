
import React from 'react';

// Block component represents a single block in the script area
function Block({ type, params, onParamChange, onDelete }) {
  // Render input fields for block parameters
  const renderParams = () => {
    return Object.entries(params).map(([key, value]) => (
      <input
        key={key}
        type="number"
        value={value}
        onChange={(e) => {
          e.stopPropagation(); // Prevent drag from starting when interacting with input
          onParamChange(key, parseInt(e.target.value, 10));
        }}
        onClick={(e) => e.stopPropagation()} // Prevent drag from starting when clicking input
        className="w-12 mx-1 text-center border rounded bg-white text-black"
      />
    ));
  };

  // Determine the background color of the block based on its type
  const getBlockStyle = () => {
    switch (type) {
      case 'motion-move':
        return 'bg-blue-500';
      case 'motion-turn-clockwise':
      case 'motion-turn-counterclockwise':
        return 'bg-blue-700';
      case 'motion-goto':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`p-2 rounded-lg text-white flex items-center justify-between ${getBlockStyle()}`}>
      <div className="flex-grow">
        {/* Render different content based on block type */}
        {type === 'motion-move' && (
          <span>Move {renderParams()} steps</span>
        )}
        {type === 'motion-turn-clockwise' && (
          <span>Turn ↻ {renderParams()} degrees</span>
        )}
        {type === 'motion-turn-counterclockwise' && (
          <span>Turn ↺ {renderParams()} degrees</span>
        )}
        {type === 'motion-goto' && (
          <span>Go to x: {renderParams()[0]} y: {renderParams()[1]}</span>
        )}
      </div>
      {/* Delete button */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling up
          onDelete();
        }} 
        className="ml-2 text-red-300 hover:text-red-100"
      >
        ✕
      </button>
    </div>
  );
}

export default Block;
