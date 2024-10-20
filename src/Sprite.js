// Import React library
import React from 'react';

// Sprite component definition
const Sprite = ({ id, move }) => {
  return (
    <div 
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        position: 'absolute',
        cursor: 'move'
      }}
      draggable
      // Handle drag end event to update sprite position
      onDragEnd={(e) => move(id, { x: e.clientX, y: e.clientY })}
    >
      {/* Display sprite ID */}
      Sprite {id}
    </div>
  );
};

// Export Sprite component
export default Sprite;