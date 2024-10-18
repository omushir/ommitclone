import React from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MidArea = ({ sprites, updateSprite, addAnimation }) => {
  const onDragEnd = (result, spriteId) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

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
      {sprites.map(sprite => (
        <div key={sprite.id} className="mb-5">
          <h2 className="text-xl font-bold mb-2">Sprite {sprite.id}</h2>
          <DragDropContext onDragEnd={(result) => onDragEnd(result, sprite.id)}>
            <Droppable droppableId={`sprite-${sprite.id}`}>
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-16 p-2 border-2 border-gray-400 rounded"
                >
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
