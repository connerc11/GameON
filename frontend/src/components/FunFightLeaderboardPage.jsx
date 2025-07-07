import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import './landing-basketball.css';
import { getToken, getUsername } from '../utils/auth';
import { apiFetch } from '../utils/api';

function InstructionsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0002', position: 'relative', maxWidth: 400 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 18, color: '#e67e22' }}>How to Play Fun Fight</h2>
        <ul style={{ textAlign: 'left', fontSize: '1.08rem', color: '#444', paddingLeft: 18 }}>
          <li>Battle against a random AI opponent in turn-based combat.</li>
          <li>On your turn, choose to <b>Attack</b>, <b>Defend</b>, or use a <b>Special Attack</b> (once per battle).</li>
          <li>Defending reduces incoming damage on the next opponent turn.</li>
          <li>Win by reducing your opponent's health to zero before yours runs out.</li>
          <li>Try to win with as much health remaining as possible for a high score!</li>
        </ul>
      </div>
    </div>
  );
}

export default function FunFightLeaderboardPage() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const token = getToken();
      const username = getUsername();
      if (!token || !username) {
        setError('Please sign in to view your stats.');
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/api/scores/funfight/userstats', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const data = await res.json();
          setUserStats(data);
        } else {
          setError('Failed to load user stats.');
        }
      } catch {
        setError('Failed to load user stats.');
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

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
            Fun Fight Leaderboard
          </h1>
        </div>
        
        <button
          style={{ 
            padding: '12px 24px', 
            borderRadius: 10, 
            background: '#e67e22', 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: 16,
            border: 'none', 
            boxShadow: '0 2px 8px #e67e2222', 
            cursor: 'pointer',
            marginBottom: 20,
            alignSelf: 'center'
          }}
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        
        <Leaderboard game="funfight" limit={10} />
        
        <div style={{ marginTop: 32, background: '#2a2a2a', borderRadius: 12, padding: 20, border: '1px solid #fbbf24' }}>
          <h2 style={{ color: '#ffe066', fontSize: '1.3rem', marginBottom: 14, textAlign: 'center', letterSpacing: 0.5, fontWeight: 700 }}>Your Stats</h2>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#fbbf24' }}>Loading...</div>
          ) : error ? (
            <div style={{ color: '#ff6b6b', textAlign: 'center' }}>{error}</div>
          ) : userStats ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              <div>
                <div style={{ color: '#27ae60', fontWeight: 600, fontSize: '1.5rem' }}>🏆</div>
                <div style={{ color: '#27ae60', fontWeight: 600 }}>Wins</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{userStats.wins}</div>
              </div>
              <div>
                <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: '1.5rem' }}>💀</div>
                <div style={{ color: '#e74c3c', fontWeight: 600 }}>Losses</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{userStats.losses}</div>
              </div>
              <div>
                <div style={{ color: '#42b983', fontWeight: 600, fontSize: '1.5rem' }}>❤️</div>
                <div style={{ color: '#42b983', fontWeight: 600 }}>Best Health</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{userStats.highestHealth} HP</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
