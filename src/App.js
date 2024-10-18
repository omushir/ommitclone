import React, { useState } from "react";
import { DragDropContext } from 'react-beautiful-dnd';
import BlockPalette from "./components/BlockPalette";
import ScriptArea from "./components/ScriptArea";
import Sprite from "./components/Sprite";

function App() {
  const [sprites, setSprites] = useState([
    { id: 'sprite1', name: 'Sprite 1', x: 200, y: 200, direction: 90, scripts: [] }
  ]);
  const [selectedSprite, setSelectedSprite] = useState('sprite1');
  const [isPlaying, setIsPlaying] = useState(false);

  const addScript = (spriteId, newScript) => {
    setSprites(prevSprites => prevSprites.map(sprite =>
      sprite.id === spriteId
        ? { ...sprite, scripts: [...sprite.scripts, { ...newScript, id: Date.now() }] }
        : sprite
    ));
  };

  const updateSprite = (id, updatedProperties) => {
    setSprites(prevSprites => prevSprites.map(sprite => 
      sprite.id === id ? { ...sprite, ...updatedProperties } : sprite
    ));
  };

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
    setSprites([...sprites, {
      id: newSpriteId,
      name: `Sprite ${sprites.length + 1}`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      direction: 90,
      scripts: []
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
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
          <div className="flex-1 flex">
            <ScriptArea
              sprite={sprites.find(s => s.id === selectedSprite)}
              updateSprite={updateSprite}
            />
            <div className="w-1/2 relative bg-gray-100 border-l border-gray-300">
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
