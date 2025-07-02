import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVTrivia.css';

function InstructionsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0002', position: 'relative', maxWidth: 400 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 18, color: '#e67e22' }}>How to Play Maze Escape</h2>
        <ul style={{ textAlign: 'left', fontSize: '1.08rem', color: '#444', paddingLeft: 18 }}>
          <li>Use your arrow keys to move your player (blue square) through the maze.</li>
          <li>Start at the green square in the top-left corner.</li>
          <li>Reach the orange exit square in the bottom-right corner to win.</li>
          <li>Walls are black, open paths are white.</li>
          <li>Each maze is randomly generated every time you play!</li>
        </ul>
      </div>
    </div>
  );
}

function generateMaze(size) {
  // Simple random DFS maze generator
  const maze = Array(size).fill().map(() => Array(size).fill(1));
  const stack = [[0, 0]];
  maze[0][0] = 0;
  const dirs = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ];
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const neighbors = dirs
      .map(([dx, dy]) => [x + dx * 2, y + dy * 2, dx, dy])
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < size && ny < size && maze[nx][ny] === 1);
    if (neighbors.length) {
      const [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[x + dx][y + dy] = 0;
      maze[nx][ny] = 0;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }
  return maze;
}

export default function MazeEscape() {
  const size = 11;
  const [maze] = useState(generateMaze(size));
  const [pos, setPos] = useState([0, 0]);
  const [won, setWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e) => {
      if (won) return;
      let [x, y] = pos;
      if (e.key === 'ArrowUp' && x > 0 && maze[x - 1][y] === 0) setPos([x - 1, y]);
      if (e.key === 'ArrowDown' && x < size - 1 && maze[x + 1][y] === 0) setPos([x + 1, y]);
      if (e.key === 'ArrowLeft' && y > 0 && maze[x][y - 1] === 0) setPos([x, y - 1]);
      if (e.key === 'ArrowRight' && y < size - 1 && maze[x][y + 1] === 0) setPos([x, y + 1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pos, maze, won]);

  useEffect(() => {
    if (pos[0] === size - 1 && pos[1] === size - 1) setWon(true);
  }, [pos, size]);

  return (
    <div className="tvtrivia-container">
      <div className="tvtrivia-card" style={{ maxWidth: 500, margin: '40px auto', minHeight: 400 }}>
        <h1 className="tvtrivia-title">Maze Escape</h1>
        <button
          className="tvtrivia-next-btn"
          style={{ background: '#e67e22', color: '#fff', fontWeight: 600, marginBottom: 18 }}
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        <div style={{ margin: '18px 0', fontSize: '1.1rem' }}>Use your arrow keys to reach the orange exit square!</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, 28px)`, justifyContent: 'center', margin: '0 auto', background: '#e67e22', borderRadius: 8, padding: 6 }}>
          {maze.map((row, i) => row.map((cell, j) => {
            let bg = cell === 1 ? '#222' : '#fff';
            if (i === 0 && j === 0) bg = '#42b983';
            if (i === size - 1 && j === size - 1) bg = '#e67e22';
            if (i === pos[0] && j === pos[1]) bg = won ? '#27ae60' : '#3498db';
            return <div key={i + '-' + j} style={{ width: 26, height: 26, background: bg, borderRadius: 4, border: '1px solid #eee', boxSizing: 'border-box' }} />;
          }))}
        </div>
        {won && <div style={{ marginTop: 18, color: '#27ae60', fontWeight: 600, fontSize: '1.2rem' }}>You escaped the maze!</div>}
      </div>
      <button
        className="tvtrivia-next-btn"
        style={{ background: '#42b983', color: '#fff', fontWeight: 600, marginTop: 24, padding: '10px 30px', fontSize: '1.1rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        onClick={() => navigate('/home')}
      >
        Back to Homepage
      </button>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
