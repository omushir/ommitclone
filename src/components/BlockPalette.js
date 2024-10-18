import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const BlockPalette = () => {
  const blocks = [
    { id: 'motion-move', type: 'motion-move', text: 'Move 10 steps' },
    { id: 'motion-turn-clockwise', type: 'motion-turn-clockwise', text: 'Turn ↻ 15 degrees' },
    { id: 'motion-turn-counterclockwise', type: 'motion-turn-counterclockwise', text: 'Turn ↺ 15 degrees' },
    { id: 'motion-goto', type: 'motion-goto', text: 'Go to x:0 y:0' },
  ];

  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Blocks</h2>
      <Droppable droppableId="block-palette" isDropDisabled={true}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-blue-500 text-white p-2 mb-2 rounded cursor-move"
                  >
                    {block.text}
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

export default BlockPalette;
