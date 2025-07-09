import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TriviaGame from './components/TriviaGame';
import TVTrivia from './components/TVTrivia';
import FunFight from './components/FunFight';
import NumberSequence from './components/NumberSequence';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
import TVTriviaLeaderboardPage from './components/TVTriviaLeaderboardPage';
import TriviaGameLeaderboardPage from './components/TriviaGameLeaderboardPage';
import FunFightLeaderboardPage from './components/FunFightLeaderboardPage';
import NumberSequenceLeaderboardPage from './components/NumberSequenceLeaderboardPage';
import MathMultipliers from './components/MathMultipliers';
import QuickReaction from './components/QuickReaction';
import MazeEscape from './components/MazeEscape';
import { isAuthenticated, getUsername, clearAuth } from './utils/auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    window.location.href = '/signin';
    return null;
  }
  return children;
}

function LogoutBar() {
  const username = getUsername();
  if (!username) return null;
  const handleLogout = () => {
    clearAuth();
    window.location.href = '/signin';
  };
  return (
    <div style={{ position: 'fixed', top: 10, right: 20, zIndex: 100 }}>
      <span style={{ marginRight: 12 }}>Welcome, <b>{username}</b>!</span>
      <button onClick={handleLogout} style={{ padding: '6px 18px', borderRadius: 6, background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer' }}>Logout</button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LogoutBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/trivia-game" element={<TriviaGame />} />
        <Route path="/tvtrivia" element={<TVTrivia />} />
        <Route path="/funfight" element={<FunFight />} />
        <Route path="/numbersequence" element={<NumberSequence />} />
        <Route path="/tvtrivia-leaderboard" element={<TVTriviaLeaderboardPage />} />
        <Route path="/triviagame-leaderboard" element={<TriviaGameLeaderboardPage />} />
        <Route path="/funfight-leaderboard" element={<FunFightLeaderboardPage />} />
        <Route path="/numbersequence-leaderboard" element={<NumberSequenceLeaderboardPage />} />
        <Route path="/math-multipliers" element={<MathMultipliers />} />
        <Route path="/quick-reaction" element={<QuickReaction />} />
        <Route path="/maze-escape" element={<MazeEscape />} />
        {/* ...other routes... */}
      </Routes>
      <footer style={{
        marginTop: 'auto',
        width: '100%',
        background: 'rgba(0,0,0,0.95)',
        color: '#FFD600',
        textAlign: 'center',
        padding: '20px 0',
        fontWeight: 600,
        fontSize: '1.1rem',
        letterSpacing: '1px',
        borderTop: '2px solid #FFD600'
      }}>
        made by conner :)
      </footer>
    </Router>
  );
}
