import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const rankedGames = [
  { name: 'SportsTrivia Game', path: '/trivia-game' },
  { name: 'TV Trivia', path: '/tvtrivia' },
  { name: 'Fun Fight', path: '/funfight' },
];
const nonRankedGames = [
  { name: 'Tic Tac Toe', path: '/tic-tac-toe' },
  { name: 'Memory Game', path: '/memory-game' },
  { name: 'Snake', path: '/snake' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const isSignedIn = !!getToken();
  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';

  const handleGameClick = (path, ranked) => {
    if (ranked && !isSignedIn) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  // Auto-logout if token expires while on this page
  useEffect(() => {
    const ts = localStorage.getItem('loginTimestamp');
    if (!ts) return;
    const now = Date.now();
    const age = now - parseInt(ts, 10);
    const msLeft = 3600000 - age;
    if (msLeft <= 0) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('loginTimestamp');
      navigate('/');
    } else {
      const timer = setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('loginTimestamp');
        navigate('/');
      }, msLeft);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', minHeight: '100vh', background: nonRankedMode ? '#fffbe6' : '#fff' }}>
      {nonRankedMode && (
        <div style={{ background: '#ffe0b2', color: '#b26a00', padding: '16px 0', fontSize: '1.15rem', fontWeight: 500, marginBottom: 24, borderBottom: '2px solid #ffd180' }}>
          <span>You are playing in <b>Guest Mode</b>. Leaderboards and score saving are disabled.<br />
          To play ranked games and see your scores, <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#42b983' }} onClick={() => { sessionStorage.removeItem('nonRankedMode'); navigate('/login'); }}>create an account and sign in</span>.</span>
        </div>
      )}
      <h1>GameOn Games</h1>
      <h2>Ranked Games</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(isSignedIn && !nonRankedMode ? rankedGames : []).map((game) => (
          <li key={game.name} style={{ margin: '20px 0' }}>
            <button
              onClick={() => handleGameClick(game.path, true)}
              style={{
                fontSize: '1.5rem',
                textDecoration: 'none',
                color: '#42b983',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
      <h2>Non-Ranked Games</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {nonRankedGames.map((game) => (
          <li key={game.name} style={{ margin: '20px 0' }}>
            <button
              onClick={() => handleGameClick(game.path, false)}
              style={{
                fontSize: '1.5rem',
                textDecoration: 'none',
                color: '#888',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              {game.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
