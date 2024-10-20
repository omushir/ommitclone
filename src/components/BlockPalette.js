// Import necessary dependencies
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

// Define the available blocks
const blocks = [
  { id: 'motion-move', type: 'motion-move', label: 'Move _ steps' },
  { id: 'motion-turn-clockwise', type: 'motion-turn-clockwise', label: 'Turn _ degrees clockwise' },
  { id: 'motion-turn-counterclockwise', type: 'motion-turn-counterclockwise', label: 'Turn _ degrees counter-clockwise' },
  { id: 'motion-goto', type: 'motion-goto', label: 'Go to x: 0 y: 0' },
  { id: 'control-forever', type: 'control-forever', label: 'Forever' },
];

// BlockPalette component
function BlockPalette() {
  return (
    // Container for the block palette
    <div className="w-64 bg-gradient-to-b from-blue-400 to-blue-300 p-6 border border-blue-500 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Motion</h2>
      {/* Droppable area for blocks */}
      <Droppable droppableId="block-palette" isDropDisabled={true}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {/* Map through blocks and create draggable elements */}
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 mb-3 rounded-md shadow-lg hover:shadow-xl transition-transform transform ${
                      snapshot.isDragging ? 'opacity-70 scale-105' : 'scale-100'
                    }`}
                  >
                    <span className="text-gray-800 font-medium">{block.label}</span>
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

export default BlockPalette;
