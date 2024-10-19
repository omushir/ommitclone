import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ScriptArea = ({ sprite, updateSprite, executeScript }) => {
  const updateScriptParams = (scriptId, newParams) => {
    const updatedScripts = sprite.scripts.map(script =>
      script.id === scriptId ? { ...script, params: { ...script.params, ...newParams } } : script
    );
    updateSprite(sprite.id, { scripts: updatedScripts });
  };

  const deleteScript = (scriptId) => {
    const updatedScripts = sprite.scripts.filter(script => script.id !== scriptId);
    updateSprite(sprite.id, { scripts: updatedScripts });
  };

  const renderScriptBlock = (script) => {
    switch (script.type) {
      case 'motion-move':
        return (
          <div className="flex items-center">
            <span>move</span>
            <input
              type="number"
              value={script.params.steps}
              onChange={(e) => updateScriptParams(script.id, { steps: parseInt(e.target.value) || 0 })}
              className="w-16 mx-1 p-1 border rounded text-black"
            />
            <span>steps</span>
          </div>
        );
      case 'motion-turn-clockwise':
        return (
          <div className="flex items-center">
            <span>turn ↻</span>
            <input
              type="number"
              value={script.params.degrees}
              onChange={(e) => updateScriptParams(script.id, { degrees: parseInt(e.target.value) || 0 })}
              className="w-16 mx-1 p-1 border rounded text-black"
            />
            <span>degrees</span>
          </div>
        );
      case 'motion-turn-counterclockwise':
        return (
          <div className="flex items-center">
            <span>turn ↺</span>
            <input
              type="number"
              value={script.params.degrees}
              onChange={(e) => updateScriptParams(script.id, { degrees: parseInt(e.target.value) || 0 })}
              className="w-16 mx-1 p-1 border rounded text-black"
            />
            <span>degrees</span>
          </div>
        );
      case 'motion-goto':
        return (
          <div className="flex items-center">
            <span>go to x:</span>
            <input
              type="number"
              value={script.params.x}
              onChange={(e) => updateScriptParams(script.id, { x: parseInt(e.target.value) || 0 })}
              className="w-16 mx-1 p-1 border rounded text-black"
            />
            <span>y:</span>
            <input
              type="number"
              value={script.params.y}
              onChange={(e) => updateScriptParams(script.id, { y: parseInt(e.target.value) || 0 })}
              className="w-16 mx-1 p-1 border rounded text-black"
            />
          </div>
        );
      default:
        return <div>{script.type}</div>;
    }
  };

  return (
    <div className="flex-1 bg-white p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Scripts for {sprite.name}</h2>
      <Droppable droppableId="script-area">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-full p-4 border-2 border-dashed border-gray-300 rounded"
          >
            {sprite.scripts.map((script, index) => (
              <Draggable key={script.id} draggableId={`script-${script.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 mb-2 bg-blue-500 text-white rounded cursor-move flex justify-between items-center"
                    onDragStart={() => executeScript(sprite.id, script)}
                  >
                    <div className="flex-1">
                      {renderScriptBlock(script)}
                    </div>
                    <button
                      onClick={() => deleteScript(script.id)}
                      className="ml-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ScriptArea;
