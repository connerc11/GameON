import React from 'react';
import Leaderboard from './Leaderboard';
import './TVTrivia.css';

export default function TriviaGameLeaderboardPage() {
  return (
    <div className="tvtrivia-container">
      <button className="tvtrivia-home-btn" onClick={() => window.history.back()}>🏠 Back</button>
      <div className="tvtrivia-card" style={{ maxWidth: 500, margin: '40px auto' }}>
        <h1 className="tvtrivia-title" style={{ marginBottom: 18 }}>Trivia Game Leaderboard</h1>
        <Leaderboard game="trivia" limit={10} />
      </div>
    </div>
  );
}
