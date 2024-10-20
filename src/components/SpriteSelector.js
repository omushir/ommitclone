// Import React library
import React from 'react';

// SpriteSelector component for managing and displaying sprites
function SpriteSelector({ sprites, selectedSpriteId, onSelectSprite, onAddSprite, onDeleteSprite }) {
  return (
    // Main container for the sprite selector
    <div className="p-6 bg-gray-100 border-2 border-gray-300 rounded-lg shadow-lg">
      {/* Title for the sprite selector */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Sprites</h2>
      {/* Container for the list of sprites */}
      <div className="flex flex-col gap-3">
        {/* Map through the sprites array and render each sprite */}
        {sprites.map(sprite => (
          <div
            key={sprite.id}
            className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-transform transform hover:scale-105 shadow-md ${
              sprite.id === selectedSpriteId ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}
            onClick={() => onSelectSprite(sprite.id)}
          >
            {/* Display the sprite name */}
            <span className="flex-grow font-semibold">{sprite.name}</span>
            {/* Delete button for each sprite */}
            <button
              className="ml-3 bg-red-600 text-white px-3 py-1 rounded-lg transition hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-400"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent div's onClick
                onDeleteSprite(sprite.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {/* Button to add a new sprite */}
      <button
        className="mt-6 p-3 bg-green-500 text-white font-semibold rounded-lg w-full shadow-lg transition hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
        onClick={onAddSprite}
      >
        Add Sprite
      </button>
    </div>
  );
}

// Export the SpriteSelector component
export default SpriteSelector;
