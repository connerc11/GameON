import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth'; 


export default function Leaderboard({ game, limit = 10 }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      const token = getToken();
      if (!token) {
        setError('Please sign in to view the leaderboard.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5000/api/scores/${game}`, {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setScores(data.slice(0, limit));
          setError('');
        } else if (res.status === 401) {
          setError('Unauthorized. Please sign in.');
          setScores([]);
        } else {
          setError('Failed to load leaderboard.');
          setScores([]);
        }
      } catch {
        setError('Failed to load leaderboard.');
        setScores([]);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [game, limit]);

  if (loading) return <div style={{ color: '#fbbf24', textAlign: 'center', fontSize: '1.2rem', padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ color: '#ff6b6b', textAlign: 'center', fontSize: '1.1rem', padding: '20px', background: '#2a1a1a', borderRadius: 10, border: '1px solid #ff6b6b' }}>{error}</div>;

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ color: '#ffe066', fontSize: '1.3rem', marginBottom: 20, textAlign: 'center', fontWeight: 700 }}>Top Players</h2>
      {scores.length === 0 ? (
        <div style={{ color: '#ffe066', textAlign: 'center', fontSize: '1.1rem', padding: '20px' }}>
          No scores recorded yet. Be the first to play!
        </div>
      ) : (
        <div style={{ background: '#2a2a2a', borderRadius: 12, padding: 20, border: '1px solid #fbbf24' }}>
          {scores.map((s, i) => (
            <div 
              key={s._id || i} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: i < scores.length - 1 ? 8 : 0,
                background: i === 0 ? '#fbbf24' : i === 1 ? '#e5e7eb' : i === 2 ? '#d69e2e' : '#3a3a3a',
                color: i < 3 ? '#18181b' : '#fff',
                borderRadius: 8,
                fontWeight: i < 3 ? 700 : 600,
                fontSize: '1.1rem',
                border: i < 3 ? 'none' : '1px solid #555'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 12, fontSize: '1.2rem', fontWeight: 900 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <span>{s.username}</span>
              </div>
              <span style={{ fontWeight: 900 }}>{s.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
