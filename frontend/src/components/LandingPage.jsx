import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInModal from './SignInModal';
import './landing-basketball.css';

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
    <div style={{ background: '#111', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      <div
        style={{
          maxWidth: 500,
          margin: '40px auto',
          background: '#18181b',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0008',
          color: '#fff',
          border: '1.5px solid #fbbf24',
          padding: 24,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        {/* Sign-in status message */}
        {signInStatus && (
          <div style={{ color: signInStatus.type === 'success' ? '#27ae60' : '#e74c3c', fontWeight: 600, marginBottom: 16, fontSize: '1.1rem' }}>
            {signInStatus.message}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Basketball" style={{ width: 48, height: 48, marginRight: 16, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)' }} />
          <h1 style={{ color: '#fbbf24', fontSize: '2.8rem', textAlign: 'center', margin: 0, letterSpacing: 1 }}>
            Welcome to GameOn!
          </h1>
        </div>
        <p style={{ margin: '20px 0', color: '#ffe066', fontSize: '1.2rem', textAlign: 'center' }}>
          <b>Sign in</b> to play <span style={{ color: '#fbbf24' }}>ranked games</span> and save your scores.<br />
          <span style={{ color: '#ffe066' }}>Or play non-ranked games as a guest!</span>
        </p>
        <div
          style={{
            margin: '40px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            rowGap: 16,
          }}
        >
          <button
            onClick={() => setShowSignInModal(true)}
            style={{ minWidth: 160, margin: 5, padding: '16px 32px', fontSize: 20, background: '#fbbf24', color: '#18181b', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #fbbf2422', flex: '1 1 220px', maxWidth: 250, fontWeight: 700 }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            style={{ minWidth: 160, margin: 5, padding: '16px 32px', fontSize: 20, background: '#888', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #8882', flex: '1 1 220px', maxWidth: 250 }}
          >
            Sign Up
          </button>
          <button
            onClick={handleNonRanked}
            style={{ minWidth: 220, margin: 5, padding: '16px 32px', fontSize: 20, background: '#ffe066', color: '#18181b', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 2px 8px #ffe06622', flex: '1 1 100%', maxWidth: 500, fontWeight: 700 }}
          >
            Play Non-Ranked Games (Guest Mode)
          </button>
        </div>
        <div style={{ marginTop: 40, color: '#ffe066', fontSize: '1.1rem', textAlign: 'center' }}>
          <p><b>Ranked games</b> let you compete for high scores and appear on leaderboards.<br />
          <b>Non-ranked games</b> are for fun only—no scores will be saved and leaderboards are disabled.</p>
        </div>
        {showSignInModal && (
          <SignInModal 
            onClose={() => setShowSignInModal(false)} 
            setSignInStatus={setSignInStatus}
            modalStyle={{ top: '10%', transform: 'translateY(0)' }} // appear higher
          />
        )}
      </div>
    </div>
  );
}
