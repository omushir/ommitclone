import React, { useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';

const Sprite = ({ id, x, y, direction, scripts, isPlaying, updateSprite, color, shape }) => {
  const spriteRef = useRef(null);

  const executeScripts = useCallback(() => {
    if (isPlaying && scripts.length > 0) {
      scripts.forEach(script => {
        switch (script.type) {
          case 'motion-move':
            const speed = script.params.steps / 10; // Adjust this divisor to control overall speed
            const radians = direction * Math.PI / 180;
            const newVelocity = {
              x: speed * Math.cos(radians),
              y: -speed * Math.sin(radians)
            };
            updateSprite(id, { velocity: newVelocity });
            break;
          case 'motion-turn-clockwise':
            updateSprite(id, { direction: (direction + script.params.degrees) % 360 });
            break;
          case 'motion-turn-counterclockwise':
            updateSprite(id, { direction: (direction - script.params.degrees + 360) % 360 });
            break;
          // ... other script types ...
        }
      });
    }
  }, [isPlaying, scripts, direction, id, updateSprite]);

  useEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(executeScripts, 100); // Adjust interval as needed
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, executeScripts]);

  const handleDragStart = () => {
    if (isPlaying) {
      updateSprite(id, { velocity: { x: 0, y: 0 } });
    }
  };

  const handleDragStop = (e, data) => {
    updateSprite(id, { x: data.x, y: data.y });
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'square':
        return 'rounded-none';
      case 'triangle':
        return 'triangle';
      case 'diamond':
        return 'transform rotate-45';
      case 'pentagon':
        return 'pentagon';
      default:
        return 'rounded-full';
    }
  };

  return (
    <Draggable
      position={{ x, y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
      disabled={isPlaying}
    >
      <div
        ref={spriteRef}
        className={`absolute w-10 h-10 cursor-move ${getShapeStyle()}`}
        style={{
          backgroundColor: color,
          transform: `rotate(${direction}deg)`,
        }}
      />
    </Draggable>
  );
};

export default Sprite;
