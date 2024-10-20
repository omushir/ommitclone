// Import necessary dependencies
import React from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// MidArea component for displaying and managing sprites and their animations
const MidArea = ({ sprites, updateSprite, addAnimation }) => {
  // Handle the end of a drag operation
  const onDragEnd = (result, spriteId) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // If dragging from sidebar to a sprite, add a new animation
    if (source.droppableId === 'sidebar' && destination.droppableId.startsWith('sprite')) {
      const newAnimation = {
        id: Date.now(),
        type: draggableId,
        params: {}
      };
      addAnimation(parseInt(destination.droppableId.split('-')[1]), newAnimation);
    }
  };

  return (
    <div className="flex-1 h-full overflow-auto">
      {/* Map through sprites and render their animations */}
      {sprites.map(sprite => (
        <div key={sprite.id} className="mb-5">
          <h2 className="text-xl font-bold mb-2">Sprite {sprite.id}</h2>
          {/* DragDropContext for handling drag and drop operations */}
          <DragDropContext onDragEnd={(result) => onDragEnd(result, sprite.id)}>
            {/* Droppable area for each sprite's animations */}
            <Droppable droppableId={`sprite-${sprite.id}`}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-16 p-2 border-2 border-gray-400 rounded"
                >
                  {/* Map through animations and render as draggable items */}
                  {sprite.animations.map((animation, index) => (
                    <Draggable key={animation.id} draggableId={`${animation.id}`} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-2 bg-yellow-500 text-white rounded cursor-move"
                        >
                          {animation.type}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
};

export default MidArea;
