import React, { useState } from 'react';
import './css/FunFight.css';
import { saveAuth } from '../utils/auth';

export default function SignIn({ onSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        saveAuth(data);
        window.location.href = '/home';
      } else {
        setError(data.message || 'Sign in failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Sign In</button>
      </form>
      <div style={{marginTop:8}}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}
