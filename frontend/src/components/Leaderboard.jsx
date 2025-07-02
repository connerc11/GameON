import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth'; 


export default function Leaderboard({ game }) {
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
          setScores(data);
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
  }, [game]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ margin: '30px auto', maxWidth: 400, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(34,49,63,0.08)', padding: 18 }}>
      <h2 style={{ color: '#42b983', marginBottom: 12 }}>Leaderboard</h2>
      <ol style={{ paddingLeft: 24 }}>
        {scores.map((s, i) => (
          <li key={s._id || i} style={{ marginBottom: 6 }}>
            <b>{s.username}</b>: {s.score}
          </li>
        ))}
      </ol>
    </div>
  );
}
