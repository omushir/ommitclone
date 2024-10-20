// Import React library
import React from 'react';

// SpriteList component definition
function SpriteList({ sprites, selectedSpriteId, onSelectSprite, onAddSprite }) {
  return (
    // Main container for the sprite list
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Header section with title and Add Sprite button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Sprites</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onAddSprite}
        >
          Add Sprite
        </button>
      </div>
      {/* Scrollable container for sprite thumbnails */}
      <div className="flex space-x-4 overflow-x-auto">
        {/* Map through sprites array and render each sprite */}
        {sprites.map(sprite => (
          <div 
            key={sprite.id} 
            className={`cursor-pointer p-2 rounded ${selectedSpriteId === sprite.id ? 'bg-blue-200' : 'bg-gray-100'}`}
            onClick={() => onSelectSprite(sprite.id)}
          >
            {/* Colored square representing the sprite */}
            <div 
              className="w-16 h-16 mb-2 rounded" 
              style={{ backgroundColor: sprite.color }}
            />
            {/* Sprite name */}
            <div className="text-center">{sprite.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export the SpriteList component
export default SpriteList;
