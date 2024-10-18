import React, { useEffect, useState } from 'react';

const Sprite = ({ id, name, x, y, direction, scripts, isPlaying, updateSprite }) => {
  const [position, setPosition] = useState({ x, y });
  const [rotation, setRotation] = useState(direction);

  useEffect(() => {
    if (isPlaying) {
      executeScripts();
    }
  }, [isPlaying]);

  const executeScripts = async () => {
    for (const script of scripts) {
      await executeScript(script);
    }
  };

  const executeScript = (script) => {
    return new Promise((resolve) => {
      switch (script.type) {
        case 'motion-move':
          moveSprite(script.params.steps);
          break;
        case 'motion-turn-clockwise':
          turnSprite(script.params.degrees);
          break;
        case 'motion-turn-counterclockwise':
          turnSprite(-script.params.degrees);
          break;
        case 'motion-goto':
          gotoPosition(script.params.x, script.params.y);
          break;
        default:
          console.log('Unknown script type:', script.type);
      }
      setTimeout(resolve, 500); // Add a delay between script executions
    });
  };

  const moveSprite = (steps) => {
    const radians = rotation * (Math.PI / 180);
    const newX = position.x + steps * Math.cos(radians);
    const newY = position.y - steps * Math.sin(radians);
    setPosition({ x: newX, y: newY });
    updateSprite(id, { x: newX, y: newY });
  };

  const turnSprite = (degrees) => {
    const newRotation = (rotation + degrees + 360) % 360; // Ensure positive value
    setRotation(newRotation);
    updateSprite(id, { direction: newRotation });
  };

  const gotoPosition = (newX, newY) => {
    setPosition({ x: newX, y: newY });
    updateSprite(id, { x: newX, y: newY });
  };

  return (
    <div
      className="absolute w-20 h-20 bg-red-500 rounded-full flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${rotation}deg)`,
        transition: 'all 0.5s',
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-1/2 w-2 h-8 bg-white -translate-x-1/2"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
          {name}
        </div>
        <div className="absolute bottom-1 left-1/2 text-xs text-white -translate-x-1/2">
          {rotation.toFixed(0)}°
        </div>
      </div>
    </div>
  );
};

export default Sprite;
