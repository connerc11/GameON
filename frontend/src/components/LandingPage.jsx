import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from './SignInModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInStatus, setSignInStatus] = useState(null); // { type: 'success'|'error', message: string }

  // Auto-redirect to /home if already signed in
  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const ts = sessionStorage.getItem('loginTimestamp') || localStorage.getItem('loginTimestamp');
    if (token && ts) {
      const now = Date.now();
      const age = now - parseInt(ts, 10);
      if (age <= 3600000) {
        navigate('/home');
      }
    }
  }, [navigate]);

  // Hide modal if already signed in
  useEffect(() => {
    const auth = sessionStorage.getItem('auth') || localStorage.getItem('auth');
    if (showSignInModal && auth) {
      setShowSignInModal(false);
    }
  }, [showSignInModal]);

  // Handler for non-ranked games: set a flag in sessionStorage
  const handleNonRanked = () => {
    sessionStorage.setItem('nonRankedMode', 'true');
    navigate('/home');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 80, minHeight: '100vh', background: '#f9f9f9' }}>
      {/* Sign-in status message */}
      {signInStatus && (
        <div style={{ color: signInStatus.type === 'success' ? '#27ae60' : '#e74c3c', fontWeight: 600, marginBottom: 16, fontSize: '1.1rem' }}>
          {signInStatus.message}
        </div>
      )}
      <h1 style={{ color: '#42b983', fontSize: '2.8rem', marginBottom: 10 }}>Welcome to GameOn!</h1>
      <p style={{ margin: '20px 0', color: '#444', fontSize: '1.2rem' }}>
        <b>Sign in</b> to play <span style={{ color: '#42b983' }}>ranked games</span> and save your scores.<br />
        <span style={{ color: '#e67e22' }}>Or play non-ranked games as a guest!</span>
      </p>
      <div style={{ margin: '40px 0', display: 'flex', justifyContent: 'center', gap: 24 }}>
        <button
          onClick={() => setShowSignInModal(true)}
          style={{ minWidth: 160, margin: 10, padding: '16px 32px', fontSize: 20, background: '#42b983', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #42b98322' }}
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{ minWidth: 160, margin: 10, padding: '16px 32px', fontSize: 20, background: '#888', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #8882' }}
        >
          Sign Up
        </button>
        <button
          onClick={handleNonRanked}
          style={{ minWidth: 220, margin: 10, padding: '16px 32px', fontSize: 20, background: '#e67e22', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #e67e2222' }}
        >
          Play Non-Ranked Games (Guest Mode)
        </button>
      </div>
      <div style={{ marginTop: 40, color: '#888', fontSize: '1.1rem' }}>
        <p><b>Ranked games</b> let you compete for high scores and appear on leaderboards.<br />
        <b>Non-ranked games</b> are for fun only—no scores will be saved and leaderboards are disabled.</p>
      </div>
      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} setSignInStatus={setSignInStatus} />
      )}
    </div>
  );
}
