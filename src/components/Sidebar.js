import React from "react";
import Icon from "./Icon";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const motionBlocks = [
  { id: 'move', content: 'Move ___ steps' },
  { id: 'turn', content: 'Turn ___ degrees' },
  { id: 'goto', content: 'Go to x: ___ y: ___' },
];

const Sidebar = ({ addSprite }) => {
  const onDragEnd = (result) => {
    // Handle drag end if needed
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-5">Motion</div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sidebar">
          {(provided) => (
            <ul className="blocks" {...provided.droppableProps} ref={provided.innerRef}>
              {motionBlocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="block p-2 mb-2 bg-blue-500 text-white rounded cursor-move"
                    >
                      {block.content}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button
        className="mt-5 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={addSprite}
      >
        Add Sprite
      </button>
    </div>
  );
};

export default Sidebar;
