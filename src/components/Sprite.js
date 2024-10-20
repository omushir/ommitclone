// Import React library
import React from 'react';

// Sprite component definition
function Sprite({ sprite, isPlaying }) {
  // Define the style for the sprite
  const spriteStyle = {
    position: 'absolute',
    left: `${sprite.x}px`,  // Set horizontal position
    top: `${sprite.y}px`,   // Set vertical position
    transform: `rotate(${sprite.direction}deg)`,  // Set rotation
    transition: isPlaying ? 'all 0.1s linear' : 'none',  // Add transition effect when playing
  };

  // Render the sprite
  return (
    <div style={spriteStyle}>
      {/* Placeholder for sprite image or SVG */}
      {/* Currently using a red circle as a placeholder */}
      <div className="w-10 h-10 bg-red-500 rounded-full"></div>
    </div>
  );
}

// Export the Sprite component
export default Sprite;
