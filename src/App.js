import React, { useState, useCallback, useEffect, useRef } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import BlockPalette from "./components/BlockPalette";
import ScriptArea from "./components/ScriptArea";
import Sprite from "./components/Sprite";

// Add this array of colors and shapes
const spriteStyles = [
  { color: 'blue', shape: 'circle' },
  { color: 'red', shape: 'square' },
  { color: 'green', shape: 'triangle' },
  { color: 'yellow', shape: 'diamond' },
  { color: 'purple', shape: 'pentagon' },
];

function App() {
  const [sprites, setSprites] = useState([
    { 
      id: 'sprite1', 
      name: 'Sprite 1', 
      x: 200, 
      y: 200, 
      direction: 90, 
      scripts: [],
      color: spriteStyles[0].color,
      shape: spriteStyles[0].shape,
      velocity: { x: 0, y: 0 }  // Initial velocity set to 0
    }
  ]);
  const [selectedSprite, setSelectedSprite] = useState('sprite1');
  const [isPlaying, setIsPlaying] = useState(false);
  const spriteAreaRef = useRef(null);

  const addScript = (spriteId, newScript) => {
    setSprites(prevSprites => prevSprites.map(sprite =>
      sprite.id === spriteId
        ? { ...sprite, scripts: [...sprite.scripts, { ...newScript, id: Date.now() }] }
        : sprite
    ));
  };

  const updateSprite = useCallback((id, updatedProperties) => {
    setSprites(prevSprites => prevSprites.map(sprite => 
      sprite.id === id ? { ...sprite, ...updatedProperties } : sprite
    ));
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === 'block-palette' && destination.droppableId === 'script-area') {
      const newScriptType = result.draggableId;
      addScript(selectedSprite, { type: newScriptType, params: getDefaultParams(newScriptType) });
    }
  };

  const getDefaultParams = (scriptType) => {
    switch (scriptType) {
      case 'motion-move':
        return { steps: 10 };
      case 'motion-turn-clockwise':
      case 'motion-turn-counterclockwise':
        return { degrees: 15 };
      case 'motion-goto':
        return { x: 0, y: 0 };
      default:
        return {};
    }
  };

  const addNewSprite = () => {
    const newSpriteId = `sprite${sprites.length + 1}`;
    const styleIndex = sprites.length % spriteStyles.length;
    setSprites([...sprites, {
      id: newSpriteId,
      name: `Sprite ${sprites.length + 1}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      direction: 90,
      scripts: [],
      color: spriteStyles[styleIndex].color,
      shape: spriteStyles[styleIndex].shape,
      velocity: { x: 2, y: 0 }  // Initial velocity
    }]);
    setSelectedSprite(newSpriteId);
  };

  const deleteSprite = (spriteId) => {
    if (sprites.length > 1) {
      const newSprites = sprites.filter(sprite => sprite.id !== spriteId);
      setSprites(newSprites);
      if (selectedSprite === spriteId) {
        setSelectedSprite(newSprites[0].id);
      }
    } else {
      alert("You can't delete the last sprite!");
    }
  };

  const handlePlayStop = () => {
    setIsPlaying(prev => !prev);
    if (!isPlaying) {
      // Start all sprites when play is pressed
      setSprites(prevSprites => prevSprites.map(sprite => ({
        ...sprite,
        velocity: { x: 0, y: 0 } // Reset velocity, it will be set by scripts
      })));
    } else {
      // Stop all sprites when stop is pressed
      setSprites(prevSprites => prevSprites.map(sprite => ({
        ...sprite,
        velocity: { x: 0, y: 0 }
      })));
    }
  };

  const handleCollisionsAndBounces = useCallback(() => {
    if (!isPlaying || !spriteAreaRef.current) return;

    const spriteAreaRect = spriteAreaRef.current.getBoundingClientRect();
    const containerWidth = spriteAreaRect.width;
    const containerHeight = spriteAreaRect.height;

    setSprites(prevSprites => {
      const newSprites = [...prevSprites];

      for (let i = 0; i < newSprites.length; i++) {
        const sprite = newSprites[i];
        
        if (sprite.scripts && sprite.scripts.length > 0) {
          let { x, y, direction, velocity } = sprite;
          const spriteSize = 40; // Assuming sprite size is 40px

          // Handle edge bounces
          if (x <= 0 || x >= containerWidth - spriteSize) {
            velocity.x = -velocity.x;
            direction = 180 - direction;
          }
          if (y <= 0 || y >= containerHeight - spriteSize) {
            velocity.y = -velocity.y;
            direction = 360 - direction;
          }

          // Update position based on velocity
          x += velocity.x;
          y += velocity.y;

          // Ensure sprite stays within bounds
          x = Math.max(0, Math.min(x, containerWidth - spriteSize));
          y = Math.max(0, Math.min(y, containerHeight - spriteSize));

          // Normalize direction
          direction = (direction + 360) % 360;

          // Check collisions with other sprites
          for (let j = 0; j < newSprites.length; j++) {
            if (i !== j && newSprites[j].scripts && newSprites[j].scripts.length > 0) {
              const otherSprite = newSprites[j];
              const dx = otherSprite.x - x;
              const dy = otherSprite.y - y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < spriteSize) {
                // Collision detected, reverse directions
                direction = (direction + 180) % 360;
                otherSprite.direction = (otherSprite.direction + 180) % 360;

                // Reverse velocities
                velocity.x = -velocity.x;
                velocity.y = -velocity.y;
                otherSprite.velocity.x = -otherSprite.velocity.x;
                otherSprite.velocity.y = -otherSprite.velocity.y;

                // Move sprites apart to prevent sticking
                const angle = Math.atan2(dy, dx);
                const separationDistance = spriteSize - distance;
                x -= (separationDistance * Math.cos(angle)) / 2;
                y -= (separationDistance * Math.sin(angle)) / 2;
                otherSprite.x += (separationDistance * Math.cos(angle)) / 2;
                otherSprite.y += (separationDistance * Math.sin(angle)) / 2;
              }
            }
          }

          // Update sprite properties
          Object.assign(sprite, { x, y, direction, velocity });
        }
      }

      return newSprites;
    });
  }, [isPlaying]);

  useEffect(() => {
    let animationFrameId;
    if (isPlaying) {
      const animate = () => {
        handleCollisionsAndBounces();
        animationFrameId = requestAnimationFrame(animate);
      };
      animationFrameId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, handleCollisionsAndBounces]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen">
        <BlockPalette />
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Sprites</h2>
              <div className="flex flex-wrap gap-2">
                {sprites.map(sprite => (
                  <div key={sprite.id} className="flex items-center">
                    <button
                      onClick={() => setSelectedSprite(sprite.id)}
                      className={`px-2 py-1 rounded ${selectedSprite === sprite.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    >
                      {sprite.name}
                    </button>
                    {sprites.length > 1 && (
                      <button
                        onClick={() => deleteSprite(sprite.id)}
                        className="ml-1 px-2 py-1 rounded bg-red-500 text-white"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addNewSprite} className="px-2 py-1 rounded bg-green-500 text-white">
                  + New Sprite
                </button>
              </div>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handlePlayStop}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
          <div className="flex-1 flex">
            <ScriptArea
              sprite={sprites.find(s => s.id === selectedSprite)}
              updateSprite={updateSprite}
            />
            <div 
              ref={spriteAreaRef}
              className="w-1/2 relative bg-gray-100 border-l border-gray-300"
            >
              {sprites.map(sprite => (
                <Sprite
                  key={sprite.id}
                  {...sprite}
                  isPlaying={isPlaying}
                  updateSprite={updateSprite}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
