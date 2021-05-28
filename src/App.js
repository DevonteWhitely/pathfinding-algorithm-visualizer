import React from 'react';
import './App.css';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <h1>Pathfinding Algorithm Visualizer</h1>
      <Header />
      <PathfindingVisualizer />
    </div>
  );
}

export default App;
