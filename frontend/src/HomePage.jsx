import React from 'react';

const games = [
  { name: 'Tic Tac Toe', path: '/tic-tac-toe' },
  { name: 'Memory Game', path: '/memory-game' },
  { name: 'Snake', path: '/snake' },
  // Add more games here
];

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to GameOn!</h1>
      <h2>Choose a game to play:</h2>
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
