import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import TriviaGame from './components/TriviaGame';
import TVTrivia from './components/TVTrivia';
import FunFight from './components/FunFight';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LandingPage from './components/LandingPage';
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
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
}
