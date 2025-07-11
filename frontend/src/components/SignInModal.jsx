import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth } from '../utils/auth';
import { apiFetch } from '../utils/api';

export default function SignInModal({ onClose, setSignInStatus, modalStyle }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      setSignInStatus && setSignInStatus({ type: 'error', message: 'Sign in: failed - Please fill in all fields.' });
      return;
    }
    try {
      const res = await apiFetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveAuth(data);
        setSignInStatus && setSignInStatus({ type: 'success', message: 'Sign in: success' });
        onClose();
        setTimeout(() => navigate('/home'), 50); // Ensure modal unmounts before navigation
      } else {
        setError(data.message || 'Sign in failed.');
        setSignInStatus && setSignInStatus({ type: 'error', message: `Sign in: failed - ${data.message || 'Sign in failed.'}` });
      }
    } catch (err) {
      setError('Server error.');
      setSignInStatus && setSignInStatus({ type: 'error', message: 'Sign in: failed - Server error.' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(24,24,27,0.92)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        ...modalStyle,
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: '60px auto 0',
          background: '#23232a',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0008',
          color: '#fff',
          border: '1px solid #333',
          padding: 24,
          position: 'relative',
          width: '90vw',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#fff' }}>×</button>
        <h2 style={{ marginBottom: 18, color: '#fff' }}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #444', background: '#333', color: '#fff' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, fontSize: 16, borderRadius: 8, border: '1px solid #444', background: '#333', color: '#fff' }}
          />
          {error && <div style={{ color: '#e74c3c', marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{
            width: '100%', padding: 10, background: '#42b983', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, marginBottom: 10
          }}>Sign In</button>
        </form>
        <button
          onClick={() => { onClose(); navigate('/signup'); }}
          style={{
            width: '100%', padding: 10, background: '#888', color: '#fff', border: 'none', borderRadius: 6, fontSize: 16
          }}
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}
