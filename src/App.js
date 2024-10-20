// Import necessary dependencies
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import BlockPalette from './components/BlockPalette';
import ScriptArea from './components/ScriptArea';
import Stage from './components/Stage';
import SpriteSelector from './components/SpriteSelector';
import { getRandomColor, getRandomShape } from './utils/spriteUtils';

// Define constants for stage dimensions and sprite size
const STAGE_WIDTH = 590;
const STAGE_HEIGHT = 740;
const SPRITE_SIZE = 40;

// Define initial positions for sprites
const initialSpritePositions = {
  sprite1: { x: 100, y: 100 },
  sprite2: { x: 200, y: 200 },
  // Add more initial positions for other sprites
};

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  // State for sprites and selected sprite ID
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: 'Sprite 1',
      x: initialSpritePositions.sprite1.x,
      y: initialSpritePositions.sprite1.y,
      direction: 90,
      scripts: [],
      color: getRandomColor(),
      shape: getRandomShape(),
      animation: null
    }
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(1);
  
  // Refs for managing intervals and running state
  const intervalsRef = useRef({});
  const isRunningRef = useRef(false);

  // Add error state
  const [error, setError] = useState(null);

  // Function to check collision between two sprites
  const checkCollision = (sprite1, sprite2) => {
    const distance = Math.sqrt(
      Math.pow(sprite1.x - sprite2.x, 2) + Math.pow(sprite1.y - sprite2.y, 2)
    );
    return distance < SPRITE_SIZE;
  };

  // Function to swap animations between two sprites
  const swapAnimations = (sprite1, sprite2) => {
    const tempAnimation = sprite1.animation;
    sprite1.animation = sprite2.animation;
    sprite2.animation = tempAnimation;
    return [sprite1, sprite2];
  };

  // Function to execute a single script for a sprite
  const executeScript = useCallback((sprite, script, allSprites) => {
    if (!isRunningRef.current) return sprite;

    let updatedSprite = { ...sprite };

    // Function to handle collision between sprites
    const handleCollision = (newX, newY) => {
      const collidedSprite = allSprites.find(otherSprite => 
        otherSprite.id !== updatedSprite.id && checkCollision({...updatedSprite, x: newX, y: newY}, otherSprite)
      );

      if (collidedSprite) {
        // Reverse direction for both sprites
        updatedSprite.direction = (updatedSprite.direction + 180) % 360;
        
        // Update the collided sprite
        const updatedCollidedSprite = {
          ...collidedSprite,
          direction: (collidedSprite.direction + 180) % 360
        };
        
        // Update the sprites array with the collided sprite's new direction
        setSprites(prevSprites => prevSprites.map(s => 
          s.id === updatedCollidedSprite.id ? updatedCollidedSprite : s
        ));

        return true;
      }
      return false;
    };

    // Switch statement to handle different script types
    switch (script.type) {
      case 'motion-move':
        // Calculate new position based on direction and distance
        const distance = script.params.steps || 0;
        const radians = updatedSprite.direction * (Math.PI / 180);
        let moveX = updatedSprite.x + distance * Math.cos(radians);
        let moveY = updatedSprite.y - distance * Math.sin(radians);

        // Handle collision if occurs
        if (handleCollision(moveX, moveY)) {
          // Recalculate new position with reversed direction
          moveX = updatedSprite.x + distance * Math.cos(updatedSprite.direction * (Math.PI / 180));
          moveY = updatedSprite.y - distance * Math.sin(updatedSprite.direction * (Math.PI / 180));
        }

        // Check if the sprite touches the edge of the stage
        if (moveX <= SPRITE_SIZE / 2 || moveX >= STAGE_WIDTH - SPRITE_SIZE / 2 ||
            moveY <= SPRITE_SIZE / 2 || moveY >= STAGE_HEIGHT - SPRITE_SIZE / 2) {
          // Reverse the direction
          updatedSprite.direction = (updatedSprite.direction + 180) % 360;
          
          // Recalculate the new position with the reversed direction
          moveX = updatedSprite.x + distance * Math.cos(updatedSprite.direction * (Math.PI / 180));
          moveY = updatedSprite.y - distance * Math.sin(updatedSprite.direction * (Math.PI / 180));
        }

        // Ensure the sprite stays within the stage boundaries
        updatedSprite.x = Math.max(SPRITE_SIZE / 2, Math.min(STAGE_WIDTH - SPRITE_SIZE / 2, moveX));
        updatedSprite.y = Math.max(SPRITE_SIZE / 2, Math.min(STAGE_HEIGHT - SPRITE_SIZE / 2, moveY));
        break;
      case 'motion-turn-clockwise':
        // Update direction for clockwise turn
        updatedSprite.direction = (updatedSprite.direction + (script.params.degrees || 15)) % 360;
        break;
      case 'motion-turn-counterclockwise':
        // Update direction for counterclockwise turn
        updatedSprite.direction = (updatedSprite.direction - (script.params.degrees || 15) + 360) % 360;
        break;
      case 'motion-goto':
        // Move sprite to specified coordinates
        let gotoX = Math.max(SPRITE_SIZE / 2, Math.min(STAGE_WIDTH - SPRITE_SIZE / 2, script.params.x || 0));
        let gotoY = Math.max(SPRITE_SIZE / 2, Math.min(STAGE_HEIGHT - SPRITE_SIZE / 2, script.params.y || 0));

        // Handle collision for goto movement
        if (handleCollision(gotoX, gotoY)) {
          // If collision occurred, don't move the sprite
          gotoX = updatedSprite.x;
          gotoY = updatedSprite.y;
        }

        updatedSprite.x = gotoX;
        updatedSprite.y = gotoY;
        break;
      // ... (other cases remain unchanged)
    }

    return updatedSprite;
  }, [STAGE_WIDTH, STAGE_HEIGHT, SPRITE_SIZE, setSprites]);

  // Function to execute all scripts for a sprite
  const executeAllScripts = useCallback((sprite, allSprites) => {
    if (!isRunningRef.current) return sprite;

    let updatedSprite = { ...sprite };
    sprite.scripts.forEach(script => {
      if (script.type !== 'control-forever') {
        updatedSprite = executeScript(updatedSprite, script, allSprites);
      }
    });
    return updatedSprite;
  }, [executeScript]);

  // Function to start continuous execution of scripts
  const startForeverExecution = useCallback((spriteId) => {
    const intervalId = setInterval(() => {
      if (isRunningRef.current) {
        setSprites(prevSprites => {
          const updatedSprites = prevSprites.map(sprite => 
            sprite.id === spriteId ? executeAllScripts(sprite, prevSprites) : sprite
          );
          return updatedSprites;
        });
      }
    }, 100);

    intervalsRef.current[spriteId] = intervalId;
  }, [executeAllScripts]);

  // Function to stop all running scripts
  const stopAllScripts = useCallback(() => {
    Object.values(intervalsRef.current).forEach(clearInterval);
    intervalsRef.current = {};
    isRunningRef.current = false;
    setSprites(prevSprites => [...prevSprites]);
  }, []);

  // Function to handle the "Go" (green flag) action
  const handleGreenFlag = useCallback(() => {
    try {
      stopAllScripts();
      isRunningRef.current = true;
      setSprites(prevSprites => 
        prevSprites.map(sprite => {
          if (sprite.scripts.some(script => script.type === 'control-forever')) {
            startForeverExecution(sprite.id);
            return sprite;
          } else {
            return executeAllScripts(sprite, prevSprites);
          }
        })
      );
    } catch (err) {
      console.error('Error in handleGreenFlag:', err);
      setError(err.message);
    }
  }, [executeAllScripts, startForeverExecution, stopAllScripts]);

  // Function to add a new script to a sprite
  const addScript = useCallback((spriteId, script) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite =>
        sprite.id === spriteId
          ? { 
              ...sprite, 
              scripts: [...sprite.scripts, { ...script, id: Date.now() }],
              animation: script.type === 'motion-move' ? script : sprite.animation
            }
          : sprite
      )
    );
  }, []);

  // Function to add a new sprite
  const addNewSprite = useCallback(() => {
    const newSprite = {
      id: Date.now(),
      name: `Sprite ${sprites.length + 1}`,
      x: Math.random() * STAGE_WIDTH,
      y: Math.random() * STAGE_HEIGHT,
      direction: 90,
      scripts: [],
      color: getRandomColor(),
      shape: getRandomShape(),
      animation: null
    };
    setSprites(prevSprites => [...prevSprites, newSprite]);
    setSelectedSpriteId(newSprite.id);
  }, [sprites.length]);

  // Function to handle sprite dragging on the stage
  const handleSpriteDrag = useCallback((spriteId, newX, newY) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite =>
        sprite.id === spriteId
          ? {
              ...sprite,
              x: Math.max(SPRITE_SIZE / 2, Math.min(STAGE_WIDTH - SPRITE_SIZE / 2, newX)),
              y: Math.max(SPRITE_SIZE / 2, Math.min(STAGE_HEIGHT - SPRITE_SIZE / 2, newY))
            }
          : sprite
      )
    );
  }, []);

  // Function to get default parameters for different script types
  const getDefaultParams = (scriptType) => {
    switch (scriptType) {
      case 'motion-move':
        return { steps: 10 };
      case 'motion-turn-clockwise':
      case 'motion-turn-counterclockwise':
        return { degrees: 15 };
      case 'motion-goto':
        return { x: 0, y: 0 };
      // Add other cases for different script types
      default:
        return {};
    }
  };

  // Function to handle the end of a drag operation
  const onDragEnd = useCallback((result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'block-palette' && destination.droppableId === 'script-area') {
      setSprites(prevSprites => 
        prevSprites.map(sprite => 
          sprite.id === selectedSpriteId
            ? {
                ...sprite,
                scripts: [
                  ...sprite.scripts,
                  {
                    id: Date.now().toString(),
                    type: draggableId,
                    params: getDefaultParams(draggableId)
                  }
                ]
              }
            : sprite
        )
      );
    }
  }, [selectedSpriteId]);

  // Function to delete a script from a sprite
  const deleteScript = (spriteId, scriptId) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite =>
        sprite.id === spriteId
          ? { ...sprite, scripts: sprite.scripts.filter(script => script.id !== scriptId) }
          : sprite
      )
    );
  };

  // Function to reset all sprites to their initial positions
  const handleReset = useCallback(() => {
    setSprites(prevSprites => prevSprites.map(sprite => ({
      ...sprite,
      x: initialSpritePositions[sprite.id]?.x || STAGE_WIDTH / 2,
      y: initialSpritePositions[sprite.id]?.y || STAGE_HEIGHT / 2,
      direction: 90, // or whatever the initial direction should be
      scripts: []    // Clear all scripts
    })));
  }, []);

  // Function to delete a sprite
  const deleteSprite = useCallback((spriteId) => {
    setSprites(prevSprites => {
      const updatedSprites = prevSprites.filter(sprite => sprite.id !== spriteId);
      if (updatedSprites.length === 0) {
        // If we're deleting the last sprite, add a new one
        const newSprite = {
          id: Date.now(),
          name: 'Sprite 1',
          x: Math.random() * (STAGE_WIDTH - SPRITE_SIZE),
          y: Math.random() * (STAGE_HEIGHT - SPRITE_SIZE),
          direction: 90,
          scripts: [],
          color: getRandomColor(),
          shape: getRandomShape(),
        };
        return [newSprite];
      }
      return updatedSprites;
    });

    setSelectedSpriteId(prevSelectedId => {
      if (prevSelectedId === spriteId) {
        return sprites.find(s => s.id !== spriteId)?.id || null;
      }
      return prevSelectedId;
    });
  }, [sprites, STAGE_WIDTH, STAGE_HEIGHT, SPRITE_SIZE]);

  // Effect for debugging: log current sprites and selected sprite ID
  useEffect(() => {
    console.log('Current sprites:', sprites);
    console.log('Selected sprite ID:', selectedSpriteId);
  }, [sprites, selectedSpriteId]);

  // ... (rest of the component remains unchanged)

  return (
    <ErrorBoundary>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-screen bg-gray-100">
  <BlockPalette />
  <div className="flex-1 flex flex-col">
    <div className="p-4 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 flex justify-between items-center border-b-2 border-gray-400 shadow-md">
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        onClick={handleGreenFlag}
      >
        Go
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
        onClick={stopAllScripts}
      >
        Stop
      </button>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 flex flex-col overflow-hidden">
              <SpriteSelector 
                sprites={sprites} 
                selectedSpriteId={selectedSpriteId} 
                onSelectSprite={setSelectedSpriteId} 
                onAddSprite={addNewSprite}
                onDeleteSprite={deleteSprite}
              />
              <div className="flex-1 overflow-y-auto">
                {selectedSpriteId && (
                  <ScriptArea
                    sprite={sprites.find(s => s.id === selectedSpriteId)}
                    updateSprite={(id, updates) => setSprites(prevSprites => 
                      prevSprites.map(s => s.id === id ? { ...s, ...updates } : s)
                    )}
                    deleteScript={deleteScript}
                  />
                )}
              </div>
            </div>
            <Stage 
              sprites={sprites} 
              width={STAGE_WIDTH} 
              height={STAGE_HEIGHT} 
              onSpriteDrag={handleSpriteDrag}
            />
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </DragDropContext>
    </ErrorBoundary>
  );
}

export default App;
