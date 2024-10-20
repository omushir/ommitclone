// Import necessary dependencies
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

// Define block colors for different script types
const blockColors = {
  'motion-move': 'bg-blue-500 bg-opacity-90',
  'motion-turn-clockwise': 'bg-blue-600 bg-opacity-90',
  'motion-turn-counterclockwise': 'bg-blue-700 bg-opacity-90',
  'motion-goto': 'bg-blue-800 bg-opacity-90',
  'control-forever': 'bg-green-500 bg-opacity-90',
};

// ScriptArea component to display and manage sprite scripts
function ScriptArea({ sprite, updateSprite, deleteScript }) {
  // If no sprite is provided, don't render anything
  if (!sprite) return null;

  // Handle input changes for script parameters
  const handleInputChange = (scriptId, paramName, value) => {
    updateSprite(sprite.id, {
      scripts: sprite.scripts.map(script =>
        script.id === scriptId
          ? { ...script, params: { ...script.params, [paramName]: Number(value) } }
          : script
      )
    });
  };

  // Handle script deletion
  const handleDeleteScript = (scriptId) => {
    deleteScript(sprite.id, scriptId);
  };

  // Render individual script block
  const renderScript = (script, index) => (
    <Draggable key={script.id} draggableId={script.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 p-4 ${blockColors[script.type] || 'bg-gray-500'} text-white rounded-lg shadow-lg relative transition-transform transform hover:scale-105 hover:shadow-2xl`}
        >
          <div className="flex items-center">
            {/* Render different content based on script type */}
            {script.type === 'control-forever' && <span className="font-bold mr-2">Forever</span>}
            {script.type === 'motion-move' && (
              <>
                <span className="font-semibold">Move</span>
                <input
                  type="number"
                  value={script.params.steps}
                  onChange={(e) => handleInputChange(script.id, 'steps', e.target.value)}
                  className="ml-2 w-16 text-black px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <span className="ml-2">steps</span>
              </>
            )}
            {script.type === 'motion-turn-clockwise' && (
              <>
                <span className="font-semibold">Turn</span>
                <input
                  type="number"
                  value={script.params.degrees}
                  onChange={(e) => handleInputChange(script.id, 'degrees', e.target.value)}
                  className="ml-2 w-16 text-black px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <span className="ml-2">degrees clockwise</span>
              </>
            )}
            {script.type === 'motion-turn-counterclockwise' && (
              <>
                <span className="font-semibold">Turn</span>
                <input
                  type="number"
                  value={script.params.degrees}
                  onChange={(e) => handleInputChange(script.id, 'degrees', e.target.value)}
                  className="ml-2 w-16 text-black px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <span className="ml-2">degrees counter-clockwise</span>
              </>
            )}
            {script.type === 'motion-goto' && (
              <>
                <span className="font-semibold">Go to x:</span>
                <input
                  type="number"
                  value={script.params.x}
                  onChange={(e) => handleInputChange(script.id, 'x', e.target.value)}
                  className="ml-2 w-16 text-black px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                />
                <span className="ml-2">y:</span>
                <input
                  type="number"
                  value={script.params.y}
                  onChange={(e) => handleInputChange(script.id, 'y', e.target.value)}
                  className="ml-2 w-16 text-black px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
                />
              </>
            )}
          </div>
          {/* Delete button for script */}
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteScript(script.id);
            }}
          >
            ×
          </button>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="p-6 bg-white border-2 border-gray-300 shadow-inner h-full overflow-y-auto rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{sprite.name} Scripts</h2>
      {/* Droppable area for scripts */}
      <Droppable droppableId="script-area">
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            style={{
              minHeight: '200px',
              backgroundColor: snapshot.isDraggingOver ? '#E3F2FD' : '#F5F5F5',
              transition: 'background-color 0.2s ease',
            }}
            className="p-4 rounded-lg shadow-sm"
          >
            {/* Render all scripts for the sprite */}
            {sprite.scripts.map((script, index) => renderScript(script, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default ScriptArea;
