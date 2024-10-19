import React, { useState } from 'react';
import Sprite from './Sprite';

const Stage = () => {
  const [executionMode, setExecutionMode] = useState('forever');
  // ... other state and logic ...

  return (
    <div className="stage">
      {/* ... other components ... */}
      <div>
        <button onClick={() => setExecutionMode('once')}>Run Once</button>
        <button onClick={() => setExecutionMode('forever')}>Run Forever</button>
      </div>
      <Sprite
        // ... other props ...
        executionMode={executionMode}
      />
    </div>
  );
};

export default Stage;
