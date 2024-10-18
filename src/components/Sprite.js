import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

const Sprite = ({ id, x, y, direction, scripts, isPlaying, updateSprite }) => {
  const spriteRef = useRef(null);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isPlaying && !isDragging) {
      executeScripts(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [isPlaying, scripts, id, x, y, direction, isDragging]);

  const executeScripts = async (isMounted) => {
    for (const script of scripts) {
      if (!isMounted || isDragging) break;
      await executeScript(script);
    }
  };

  const executeScript = (script) => {
    return new Promise(resolve => {
      setTimeout(() => {
        switch (script.type) {
          case 'motion-move':
            const radians = direction * Math.PI / 180;
            const newVelocityX = Math.cos(radians) * script.params.steps;
            const newVelocityY = -Math.sin(radians) * script.params.steps;
            setVelocity({ x: newVelocityX, y: newVelocityY });
            updateSpritePosition(x + newVelocityX, y + newVelocityY);
            break;
          case 'motion-turn-clockwise':
            updateSprite(id, { direction: (direction + script.params.degrees) % 360 });
            break;
          case 'motion-turn-counterclockwise':
            updateSprite(id, { direction: (direction - script.params.degrees + 360) % 360 });
            break;
          case 'motion-goto':
            updateSpritePosition(script.params.x, script.params.y);
            break;
        }
        resolve();
      }, 500);
    });
  };

  const updateSpritePosition = (newX, newY) => {
    if (spriteRef.current) {
      const parentRect = spriteRef.current.parentElement.getBoundingClientRect();
      const spriteRect = spriteRef.current.getBoundingClientRect();

      const maxX = parentRect.width - spriteRect.width;
      const maxY = parentRect.height - spriteRect.height;

      let constrainedX = Math.max(0, Math.min(newX, maxX));
      let constrainedY = Math.max(0, Math.min(newY, maxY));
      let newDirection = direction;
      let newVelocity = { ...velocity };

      // Check for horizontal bounds and bounce
      if (newX < 0 || newX > maxX) {
        newVelocity.x = -newVelocity.x;
        newDirection = 180 - direction;
      }

      // Check for vertical bounds and bounce
      if (newY < 0 || newY > maxY) {
        newVelocity.y = -newVelocity.y;
        newDirection = 360 - direction;
      }

      // Normalize direction to be between 0 and 360
      newDirection = (newDirection + 360) % 360;

      updateSprite(id, { 
        x: constrainedX, 
        y: constrainedY,
        direction: newDirection
      });
      setVelocity(newVelocity);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (e, data) => {
    setIsDragging(false);
    updateSprite(id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={{ x, y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={spriteRef}
        className="absolute w-10 h-10 bg-blue-500 rounded-full cursor-move"
        style={{
          transform: `rotate(${direction}deg)`,
        }}
      />
    </Draggable>
  );
};

export default Sprite;
