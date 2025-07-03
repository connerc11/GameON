import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import './landing-basketball.css';

const rankedGames = [
  { name: 'SportsTrivia Game', path: '/trivia-game' },
  { name: 'TV Trivia', path: '/tvtrivia' },
  { name: 'Fun Fight', path: '/funfight' },
];
const nonRankedGames = [
  { name: 'Math Multipliers', path: '/math-multipliers' },
  { name: 'Quick Reaction', path: '/quick-reaction' },
  { name: 'Maze Escape', path: '/maze-escape' },
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
    <div style={{ background: '#111', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      {/* Sign Out button, top left */}
      <div style={{ position: 'fixed', top: 32, left: 32, zIndex: 10 }}>
        <button
          style={{ padding: '10px 24px', borderRadius: 10, background: '#fbbf24', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer' }}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('loginTimestamp');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('loginTimestamp');
            sessionStorage.removeItem('auth');
            sessionStorage.removeItem('nonRankedMode');
            navigate('/');
          }}
        >
          Sign Out
        </button>
      </div>
      <div
        style={{
          maxWidth: 500,
          margin: '80px auto 40px auto', // Move down to avoid overlap with top button
          background: '#18181b',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0008',
          color: '#fff',
          border: '1.5px solid #fbbf24',
          padding: 24,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        {nonRankedMode && (
          <div style={{ width: '100%', borderRadius: 12, background: '#ffe066', color: '#18181b', fontWeight: 600, padding: '16px 18px', marginBottom: 18, textAlign: 'center', fontSize: '1.1rem', border: '1.5px solid #fbbf24' }}>
            <span>You are playing in <b>Guest Mode</b>. Leaderboards and score saving are disabled.<br />
            To play ranked games and see your scores, <span style={{ textDecoration: 'underline', cursor: 'pointer', color: '#fbbf24' }} onClick={() => { sessionStorage.removeItem('nonRankedMode'); navigate('/signup'); }}>create an account and sign up</span>.</span>
          </div>
        )}
        {nonRankedMode && (
          <button
            onClick={() => { sessionStorage.removeItem('nonRankedMode'); navigate('/signin'); }}
            style={{ width: '100%', padding: 12, background: '#fbbf24', color: '#18181b', border: 'none', borderRadius: 10, fontSize: 20, fontWeight: 700, marginBottom: 24, cursor: 'pointer', boxShadow: '0 2px 8px #fbbf2422' }}
          >
            Sign In to Play Ranked Games
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Basketball" style={{ width: 48, height: 48, marginRight: 16, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)' }} />
          <h1 style={{ color: '#fbbf24', fontSize: '2.2rem', textAlign: 'center', margin: 0, letterSpacing: 1, fontWeight: 900 }}>
            GameOn Games
          </h1>
        </div>
        <h2 style={{ color: '#ffe066', fontSize: '1.3rem', marginBottom: 14, marginTop: 18, textAlign: 'center', fontWeight: 700 }}>Ranked Games</h2>
        <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 24, padding: 0, listStyle: 'none' }}>
          {(isSignedIn && !nonRankedMode ? rankedGames : []).map((game) => (
            <li key={game.name}>
              <button
                onClick={() => handleGameClick(game.path, true)}
                style={{ padding: '16px 32px', borderRadius: 10, background: '#fbbf24', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer', minWidth: 180, margin: 2 }}
              >
                {game.name}
              </button>
            </li>
          ))}
        </ul>
        <h2 style={{ color: '#ffe066', fontSize: '1.3rem', marginBottom: 14, marginTop: 18, textAlign: 'center', fontWeight: 700 }}>Non-Ranked Games</h2>
        <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, padding: 0, listStyle: 'none' }}>
          {nonRankedGames.map((game) => (
            <li key={game.name}>
              <button
                onClick={() => handleGameClick(game.path, false)}
                style={{ padding: '16px 32px', borderRadius: 10, background: '#ffe066', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #ffe06622', cursor: 'pointer', minWidth: 180, margin: 2 }}
              >
                {game.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
