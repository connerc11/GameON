import React from 'react';
import Leaderboard from './Leaderboard';
import './TVTrivia.css';

export default function TVTriviaLeaderboardPage() {
  return (
    <div className="tvtrivia-container">
      <button className="tvtrivia-home-btn" onClick={() => window.history.back()}>🏠 Back</button>
      <div className="tvtrivia-card" style={{ maxWidth: 500, margin: '40px auto' }}>
        <h1 className="tvtrivia-title" style={{ marginBottom: 18 }}>TV Trivia Leaderboard</h1>
        <Leaderboard game="tvtrivia" limit={10} />
      </div>
    </div>
  );
}
