import React, { useState } from 'react';
import './css/FunFight.css';
import { saveAuth } from '../utils/auth';

export default function SignUp({ onSignUp }) {
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
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Sign up failed.');
        return;
      }
      // Auto-login after sign up
      const loginRes = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        saveAuth(loginData);
        window.location.href = '/';
      } else {
        setError('Sign up succeeded but login failed.');
      }
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      <div style={{marginTop:8}}>
        Already have an account? <a href="/signin">Sign In</a>
      </div>
    </div>
  );
}
