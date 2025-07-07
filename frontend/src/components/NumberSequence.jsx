import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/NumberSequence.css';
import './landing-basketball.css';
import { getToken, getUsername } from '../utils/auth';
import { apiFetch } from '../utils/api';

// Generate different types of sequences
const generateSequence = (difficulty) => {
  const types = ['arithmetic', 'geometric', 'fibonacci', 'squares', 'primes'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  switch (type) {
    case 'arithmetic':
      const diff = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 10) + 1;
      const start = Math.floor(Math.random() * 20) + 1;
      return {
        sequence: [start, start + diff, start + 2*diff, start + 3*diff],
        answer: start + 4*diff,
        hint: `Add ${diff} each time`
      };
    
    case 'geometric':
      const mult = difficulty === 'easy' ? 2 : Math.floor(Math.random() * 3) + 2;
      const base = Math.floor(Math.random() * 5) + 1;
      return {
        sequence: [base, base * mult, base * mult * mult, base * mult * mult * mult],
        answer: base * mult * mult * mult * mult,
        hint: `Multiply by ${mult} each time`
      };
    
    case 'fibonacci':
      const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      const startIndex = Math.floor(Math.random() * 6);
      return {
        sequence: fib.slice(startIndex, startIndex + 4),
        answer: fib[startIndex + 4],
        hint: 'Add the two previous numbers'
      };
    
    case 'squares':
      const sqStart = Math.floor(Math.random() * 5) + 1;
      return {
        sequence: [sqStart*sqStart, (sqStart+1)*(sqStart+1), (sqStart+2)*(sqStart+2), (sqStart+3)*(sqStart+3)],
        answer: (sqStart+4)*(sqStart+4),
        hint: 'Perfect squares sequence'
      };
    
    case 'primes':
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
      const primeStart = Math.floor(Math.random() * 8);
      return {
        sequence: primes.slice(primeStart, primeStart + 4),
        answer: primes[primeStart + 4],
        hint: 'Prime numbers sequence'
      };
    
    default:
      return generateSequence(difficulty);
  }
};

export default function NumberSequence() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionNumber, setQuestionNumber] = useState(1);

  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';
  const isSignedIn = !!getToken();

  // Require login for ranked games
  useEffect(() => {
    if (!nonRankedMode && !getToken()) {
      navigate('/login');
    }
  }, [navigate, nonRankedMode]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [gameStarted, timeLeft, gameOver]);

  // Submit score when game ends
  async function submitScore(game, score, token) {
    try {
      const res = await apiFetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ game, score })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('Score submitted successfully:', data);
      } else {
        console.error('Error submitting score:', data.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error submitting score:', err);
    }
  }

  useEffect(() => {
    if (gameOver && isSignedIn && !nonRankedMode && getToken()) {
      submitScore('numbersequence', score, getToken());
    }
  }, [gameOver, score, isSignedIn, nonRankedMode]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    setTimeLeft(90);
    setGameOver(false);
    setQuestionNumber(1);
    generateNewSequence();
  };

  const generateNewSequence = () => {
    const newDifficulty = questionNumber > 10 ? 'hard' : questionNumber > 5 ? 'medium' : 'easy';
    setDifficulty(newDifficulty);
    setCurrentSequence(generateSequence(newDifficulty));
    setUserAnswer('');
    setShowHint(false);
    setFeedback('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer || gameOver) return;

    const answer = parseInt(userAnswer);
    if (answer === currentSequence.answer) {
      setScore(score + (difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5));
      setFeedback('Correct! 🎉');
      setQuestionNumber(questionNumber + 1);
      setTimeout(() => {
        generateNewSequence();
      }, 1000);
    } else {
      setLives(lives - 1);
      setFeedback(`Wrong! The answer was ${currentSequence.answer}`);
      if (lives <= 1) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          generateNewSequence();
        }, 2000);
      }
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
    setCurrentSequence(null);
    setUserAnswer('');
    setScore(0);
    setLives(3);
    setTimeLeft(90);
    setGameOver(false);
    setShowHint(false);
    setFeedback('');
    setQuestionNumber(1);
  };

  return (
    <div style={{ background: '#111', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      {/* Back button, top left */}
      <div style={{ position: 'fixed', top: 32, left: 32, zIndex: 10 }}>
        <button
          style={{ padding: '10px 24px', borderRadius: 10, background: '#fbbf24', color: '#18181b', fontWeight: 700, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          🏠 Back to Home
        </button>
      </div>

      <div
        style={{
          maxWidth: 500,
          margin: '80px auto 40px auto',
          background: '#18181b',
          borderRadius: 16,
          boxShadow: '0 2px 16px #0008',
          color: '#fff',
          border: '1.5px solid #fbbf24',
          padding: 24,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Basketball" style={{ width: 48, height: 48, marginRight: 16, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)' }} />
          <h1 style={{ color: '#fbbf24', fontSize: '2rem', textAlign: 'center', margin: 0, letterSpacing: 1, fontWeight: 900 }}>
            Number Sequence Challenge
          </h1>
        </div>

        {nonRankedMode && (
          <div style={{ width: '100%', borderRadius: 12, background: '#ffe066', color: '#18181b', fontWeight: 600, padding: '16px 18px', marginBottom: 18, textAlign: 'center', fontSize: '1rem', border: '1.5px solid #fbbf24' }}>
            <span>Guest Mode - Scores won't be saved</span>
          </div>
        )}

        {!gameStarted ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 24, color: '#ffe066' }}>
              Complete the number sequences! Find the pattern and enter the next number.
            </p>
            <div style={{ marginBottom: 24, padding: 16, background: '#2a2a2a', borderRadius: 10, border: '1px solid #fbbf24' }}>
              <h3 style={{ color: '#fbbf24', marginBottom: 12 }}>How to Play:</h3>
              <ul style={{ textAlign: 'left', color: '#fff', lineHeight: '1.6' }}>
                <li>Look at the sequence of numbers</li>
                <li>Find the pattern (arithmetic, geometric, etc.)</li>
                <li>Enter what comes next</li>
                <li>You have 3 lives and 90 seconds</li>
                <li>Difficulty increases as you progress</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              style={{
                padding: '16px 32px',
                borderRadius: 10,
                background: '#fbbf24',
                color: '#18181b',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                boxShadow: '0 2px 8px #fbbf2422',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Start Challenge
            </button>
          </div>
        ) : (
          <div>
            {/* Game Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: '1.1rem' }}>
              <div style={{ color: '#fbbf24', fontWeight: 600 }}>Score: {score}</div>
              <div style={{ color: '#ff6b6b', fontWeight: 600 }}>Lives: {'❤️'.repeat(lives)}</div>
              <div style={{ color: '#ffe066', fontWeight: 600 }}>Time: {timeLeft}s</div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ color: '#ffe066', marginBottom: 8 }}>Question {questionNumber} - {difficulty.toUpperCase()}</div>
            </div>

            {currentSequence && !gameOver && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 20, padding: 20, background: '#2a2a2a', borderRadius: 10, border: '1px solid #fbbf24' }}>
                  <div style={{ fontSize: '1.5rem', color: '#fff', marginBottom: 16 }}>
                    {currentSequence.sequence.join(', ')}, ?
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      style={{
                        padding: '12px',
                        fontSize: '1.2rem',
                        borderRadius: 8,
                        border: '2px solid #fbbf24',
                        background: '#111',
                        color: '#fff',
                        textAlign: 'center',
                        width: '120px',
                        marginRight: 12
                      }}
                      placeholder="?"
                      autoFocus
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        borderRadius: 8,
                        background: '#fbbf24',
                        color: '#18181b',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      disabled={!userAnswer}
                    >
                      Submit
                    </button>
                  </form>
                  
                  <div style={{ marginTop: 16 }}>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 6,
                        background: showHint ? '#666' : '#333',
                        color: '#fff',
                        border: '1px solid #555',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {showHint ? 'Hide' : 'Show'} Hint
                    </button>
                    {showHint && (
                      <div style={{ marginTop: 8, color: '#ffe066', fontSize: '0.9rem' }}>
                        💡 {currentSequence.hint}
                      </div>
                    )}
                  </div>
                </div>

                {feedback && (
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: 8, 
                    background: feedback.includes('Correct') ? '#27ae60' : '#e74c3c',
                    color: '#fff',
                    fontWeight: 600,
                    marginBottom: 16
                  }}>
                    {feedback}
                  </div>
                )}
              </div>
            )}

            {gameOver && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#fbbf24', marginBottom: 16 }}>Game Over!</h2>
                <div style={{ fontSize: '1.3rem', marginBottom: 24, color: '#fff' }}>
                  Final Score: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{score}</span>
                </div>
                <div style={{ marginBottom: 24, color: '#ffe066' }}>
                  You completed {questionNumber - 1} sequences!
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleRestart}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 10,
                      background: '#fbbf24',
                      color: '#18181b',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => navigate('/numbersequence-leaderboard')}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 10,
                      background: '#42b983',
                      color: '#fff',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
