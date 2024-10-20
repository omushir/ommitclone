// Import necessary dependencies
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

// CodeArea component to display and manage sprite scripts
function CodeArea({ sprite, updateSprite }) {
  // If no sprite is provided, don't render anything
  if (!sprite) return null;

  return (
    <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
      {/* Header section displaying sprite name */}
      <div className="p-2 bg-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-bold">{sprite.name}</h2>
      </div>
      {/* Droppable area for scripts */}
      <Droppable droppableId="code-area">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 p-4 overflow-y-auto">
            {/* Map through sprite scripts and render as draggable items */}
            {sprite.scripts.map((script, index) => (
              <Draggable key={script.id} draggableId={script.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2 p-2 bg-blue-500 text-white rounded"
                  >
                    {script.type}
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
}

// Export the CodeArea component
export default CodeArea;
