import React from 'react';

const Sprite = ({ id, move }) => {
  return (
    <div 
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        position: 'absolute',
        cursor: 'move'
      }}
      draggable
      onDragEnd={(e) => move(id, { x: e.clientX, y: e.clientY })}
    >
      Sprite {id}
    </div>
  );
};

export default Sprite;
