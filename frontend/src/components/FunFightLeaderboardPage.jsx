import React, { useEffect, useState } from 'react';
import Leaderboard from './Leaderboard';
import './TVTrivia.css';
import { getToken, getUsername } from '../utils/auth';

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
        const res = await fetch(`http://localhost:5000/api/scores/funfight/userstats`, {
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
    <div className="tvtrivia-container">
      <button className="tvtrivia-home-btn" onClick={() => window.history.back()}>🏠 Back</button>
      <div className="tvtrivia-card" style={{ maxWidth: 500, margin: '40px auto' }}>
        <h1 className="tvtrivia-title" style={{ marginBottom: 18 }}>Fun Fight Leaderboard</h1>
        <button
          className="tvtrivia-next-btn"
          style={{ background: '#e67e22', color: '#fff', fontWeight: 600, marginBottom: 18 }}
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        <Leaderboard game="funfight" limit={10} />
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          <h2 style={{ color: '#e67e22', fontSize: '1.2rem', marginBottom: 10 }}>Your Stats</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : userStats ? (
            <ul style={{ fontSize: '1.1rem', color: '#444' }}>
              <li><b>Wins:</b> {userStats.wins}</li>
              <li><b>Losses:</b> {userStats.losses}</li>
              <li><b>Highest Remaining Health Win:</b> {userStats.highestHealth} HP</li>
            </ul>
          ) : null}
        </div>
      </div>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
