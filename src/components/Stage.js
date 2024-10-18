import React from 'react';
import Sprite from './Sprite';

const Stage = ({ sprites, isPlaying, updateSprite }) => {
  return (
    <div className="w-96 h-96 bg-white border-2 border-gray-300 relative overflow-hidden">
      {sprites.map(sprite => (
        <Sprite key={sprite.id} {...sprite} isPlaying={isPlaying} updateSprite={updateSprite} />
      ))}
    </div>
  );
};

export default Stage;
