import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVTrivia.css';

function InstructionsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, minWidth: 320, boxShadow: '0 2px 16px #0002', position: 'relative', maxWidth: 400 }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: 18, color: '#e67e22' }}>How to Play Math Multipliers</h2>
        <ul style={{ textAlign: 'left', fontSize: '1.08rem', color: '#444', paddingLeft: 18 }}>
          <li>Answer as many multiplication questions as you can in 60 seconds.</li>
          <li>Each question is randomly generated with numbers from 1 to 25.</li>
          <li>Type your answer and press Submit. Only correct answers count toward your score.</li>
          <li>Try to beat your high score!</li>
        </ul>
      </div>
    </div>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function MathMultipliers() {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(getRandomInt(1, 25));
  const [num2, setNum2] = useState(getRandomInt(1, 25));
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (started && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && started) {
      setGameOver(true);
    }
  }, [started, timeLeft, gameOver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer, 10) === num1 * num2) {
      setScore(s => s + 1);
    }
    setNum1(getRandomInt(1, 25));
    setNum2(getRandomInt(1, 25));
    setAnswer('');
    inputRef.current && inputRef.current.focus();
  };

  const handleStart = () => {
    setStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setNum1(getRandomInt(1, 25));
    setNum2(getRandomInt(1, 25));
    setAnswer('');
    setTimeout(() => { inputRef.current && inputRef.current.focus(); }, 100);
  };

  const handleRestart = () => {
    setStarted(false);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setNum1(getRandomInt(1, 25));
    setNum2(getRandomInt(1, 25));
    setAnswer('');
  };

  return (
    <div className="tvtrivia-container" style={{ background: '#18181b', minHeight: '100vh', color: '#fff' }}>
      <div className="tvtrivia-card" style={{ maxWidth: 700, margin: '40px auto', background: '#23232a', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1px solid #333', padding: 48 }}>
        <h1 className="tvtrivia-title" style={{ color: '#fff' }}>Math Multipliers</h1>
        <button
          className="tvtrivia-next-btn"
          style={{ background: '#e67e22', color: '#fff', fontWeight: 600, marginBottom: 18 }}
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        {!started ? (
          <button
            className="tvtrivia-next-btn"
            style={{ background: '#42b983', color: '#fff', fontWeight: 600, fontSize: '1.2rem', padding: '12px 32px', margin: '32px 0' }}
            onClick={handleStart}
          >
            Start Game
          </button>
        ) : (
          <>
            <h2 style={{ color: '#42b983', marginBottom: 18 }}>Answer as many as you can in 60 seconds!</h2>
            <div style={{ fontSize: '1.3rem', marginBottom: 18 }}>
              Time Left: <b style={{ color: timeLeft <= 10 ? '#e74c3c' : '#42b983' }}>{timeLeft}s</b>
            </div>
            <div style={{ fontSize: '1.2rem', marginBottom: 18 }}>
              Score: <b>{score}</b>
            </div>
            {!gameOver ? (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div style={{ fontSize: '1.5rem', marginBottom: 18 }}>
                  {num1} × {num2} = ?
                </div>
                <input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  style={{ fontSize: '1.2rem', padding: '8px 16px', borderRadius: 8, border: '1px solid #e67e22', marginBottom: 16, width: 120, textAlign: 'center', background: '#18181b', color: '#fff' }}
                  disabled={gameOver}
                  autoFocus
                />
                <br />
                <button
                  type="submit"
                  className="tvtrivia-next-btn"
                  style={{ marginTop: 10, background: '#42b983', color: '#fff', fontWeight: 600 }}
                  disabled={gameOver || answer === ''}
                >
                  Submit
                </button>
              </form>
            ) : (
              <>
                <div style={{ fontSize: '1.3rem', margin: '18px 0', color: '#e67e22' }}>
                  Time's up!<br />Final Score: <b>{score}</b>
                </div>
                <button
                  className="tvtrivia-next-btn"
                  style={{ background: '#42b983', color: '#fff', fontWeight: 600 }}
                  onClick={handleRestart}
                >
                  Play Again
                </button>
              </>
            )}
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
          <button
            className="tvtrivia-next-btn"
            style={{ background: '#333', color: '#fff', fontWeight: 600 }}
            onClick={() => navigate('/home')}
          >
            Back
          </button>
          <button
            className="tvtrivia-next-btn"
            style={{ background: '#42b983', color: '#fff', fontWeight: 600 }}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
