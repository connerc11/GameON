import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/MathMultipliers.css';
import { getToken } from '../utils/auth';

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

  const isSignedIn = !!getToken();

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
    <div className="mathmult-container">
      <div className="mathmult-card">
        <h1 className="mathmult-title">Math Multipliers</h1>
        <button
          className="mathmult-btn mathmult-btn-yellow"
          onClick={() => setShowInstructions(true)}
        >
          How to Play
        </button>
        {!started ? (
          <button
            className="mathmult-btn mathmult-btn-green"
            style={{ fontSize: '1.2rem', margin: '32px 0' }}
            onClick={handleStart}
          >
            Start Game
          </button>
        ) : (
          <>
            <h2 style={{ color: '#FFD600', marginBottom: 18, textAlign: 'center' }}>Answer as many as you can in 60 seconds!</h2>
            <div className="mathmult-timer">
              Time Left: <b style={{ color: timeLeft <= 10 ? '#FF5252' : '#FFD600' }}>{timeLeft}s</b>
            </div>
            <div className="mathmult-score">
              Score: <b>{score}</b>
            </div>
            {!gameOver ? (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mathmult-question">
                  {num1} × {num2} = ?
                </div>
                <input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="mathmult-input"
                  disabled={gameOver}
                  autoFocus
                />
                <br />
                <button
                  type="submit"
                  className="mathmult-btn mathmult-btn-green"
                  style={{ marginTop: 10 }}
                  disabled={gameOver || answer === ''}
                >
                  Submit
                </button>
              </form>
            ) : (
              <>
                <div className="mathmult-final">
                  Time's up!<br />Final Score: <b>{score}</b>
                </div>
                <button
                  className="mathmult-btn mathmult-btn-green"
                  onClick={handleRestart}
                >
                  Play Again
                </button>
              </>
            )}
          </>
        )}
        <div className="mathmult-nav-row">
          <button
            className="mathmult-btn mathmult-btn-green"
            onClick={() => navigate('/home')}
          >
            Back
          </button>
          {!isSignedIn && (
            <button
              className="mathmult-btn mathmult-btn-yellow"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <InstructionsModal open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  );
}
