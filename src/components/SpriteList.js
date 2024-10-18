import React from 'react';

const SpriteList = ({ sprites, selectedSprite, setSelectedSprite, addSprite }) => {
  return (
    <div className="h-32 bg-gray-200 p-2 flex items-center">
      {sprites.map(sprite => (
        <div
          key={sprite.id}
          className={`w-24 h-24 m-2 p-2 bg-white rounded cursor-pointer ${
            selectedSprite === sprite.id ? 'border-2 border-blue-500' : ''
          }`}
          onClick={() => setSelectedSprite(sprite.id)}
        >
          {sprite.name}
        </div>
      ))}
      <button
        className="w-24 h-24 m-2 bg-green-500 text-white rounded"
        onClick={addSprite}
      >
        + Add Sprite
      </button>
    </div>
  );
};

export default SpriteList;
