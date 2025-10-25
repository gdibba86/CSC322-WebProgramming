import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React Counter App</h1>
      <p>This is a simple React application demonstrating state management.</p>

      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: '10px' }}>
        Decrease
      </button>
    </div>
  );
}

export default App;
