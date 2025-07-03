import React from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import './landing-basketball.css';

export default function TriviaGameLeaderboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#111', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      {/* Back button, top left */}
      <div style={{ position: 'fixed', top: 32, left: 32, zIndex: 10 }}>
        <button
          style={{ padding: '10px 24px', borderRadius: 10, background: '#fbbf24', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          🏠 Back to Home
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
          justifyContent: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Basketball" style={{ width: 48, height: 48, marginRight: 16, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)' }} />
          <h1 style={{ color: '#fbbf24', fontSize: '2rem', textAlign: 'center', margin: 0, letterSpacing: 1, fontWeight: 900 }}>
            Trivia Game Leaderboard
          </h1>
        </div>
        <Leaderboard game="trivia" limit={10} />
      </div>
    </div>
  );
}
