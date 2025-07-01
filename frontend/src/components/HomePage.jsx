import React from 'react';
import { useNavigate } from 'react-router-dom';

const games = [
  { name: 'Trivia Game', path: '/trivia-game' },

  // Add more games here
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to GameOn!</h1>
      <h2>Choose a game to play:</h2>
      <button
        style={{ fontSize: '1.2rem', margin: '20px', padding: '10px 30px', background: '#42b983', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        onClick={() => navigate('/trivia-game')}
      >
        Play Trivia Game
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {games.map((game) => (
          <li key={game.name} style={{ margin: '20px 0' }}>
            <a href={game.path} style={{ fontSize: '1.5rem', textDecoration: 'none', color: '#42b983' }}>
              {game.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
