import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVTrivia.css';

function InstructionsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0002', position: 'relative', maxWidth: 400 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 18, color: '#e67e22' }}>How to Play Quick Reaction</h2>
        <ul style={{ textAlign: 'left', fontSize: '1.08rem', color: '#444', paddingLeft: 18 }}>
          <li>Click Start and wait for the button to turn green.</li>
          <li>As soon as it does, click as quickly as you can!</li>
          <li>If you click too early, you'll have to try again.</li>
          <li>Your reaction time will be shown in milliseconds.</li>
          <li>Try to beat your best time!</li>
        </ul>
      </div>
    </div>
  );
}

export default function QuickReaction() {
  const [waiting, setWaiting] = useState(false);
  const [started, setStarted] = useState(false);
  const [message, setMessage] = useState('Click start to begin!');
  const [reactionTime, setReactionTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const timerRef = useRef();
  const startTimeRef = useRef();
  const navigate = useNavigate();

  const startGame = () => {
    setStarted(true);
    setMessage('Wait for green...');
    setReactionTime(null);
    setWaiting(true);
    const delay = Math.random() * 2000 + 1000; // 1-3s
    timerRef.current = setTimeout(() => {
      setMessage('Click now!');
      setWaiting(false);
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (!started) return;
    if (waiting) {
      setMessage('Too soon! Try again.');
      setStarted(false);
      clearTimeout(timerRef.current);
    } else if (startTimeRef.current) {
      const rt = Date.now() - startTimeRef.current;
      setReactionTime(rt);
      setMessage(`Your reaction time: ${rt} ms`);
      setStarted(false);
    }
  };

  return (
    <div style={{ background: '#18181b', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: 500, margin: '40px auto', background: '#23232a', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1px solid #333', padding: 24 }}>
        <h1 className="tvtrivia-title">Quick Reaction</h1>
        <button
          className="tvtrivia-next-btn"
          style={{ background: '#e67e22', color: '#fff', fontWeight: 600, marginBottom: 18 }}
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        <div style={{ fontSize: '1.2rem', margin: '24px 0', color: waiting ? '#888' : '#42b983' }}>{message}</div>
        {/* Only show Start button if not started and no reactionTime */}
        {!started && reactionTime === null && (
          <button
            className="tvtrivia-next-btn"
            style={{ background: '#42b983', color: '#fff', fontWeight: 600, minWidth: 120, minHeight: 48, fontSize: '1.1rem' }}
            onClick={startGame}
          >
            Start
          </button>
        )}
        {/* Game in progress: clickable area */}
        {started && (
          <button
            className="tvtrivia-next-btn"
            style={{ background: waiting ? '#888' : '#42b983', color: '#fff', fontWeight: 600, minWidth: 120, minHeight: 48, fontSize: '1.1rem' }}
            onClick={handleClick}
          >
            {waiting ? '...' : 'CLICK!'}
          </button>
        )}
        {/* After game ends: Try Again and Back to Homepage */}
        {reactionTime !== null && !started && (
          <div style={{ marginTop: 18, color: '#e67e22', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="tvtrivia-next-btn" style={{ background: '#42b983', color: '#fff' }} onClick={startGame}>Try Again</button>
            <button className="tvtrivia-next-btn" style={{ background: '#888', color: '#fff' }} onClick={() => navigate('/home')}>Back to Homepage</button>
          </div>
        )}
      </div>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
