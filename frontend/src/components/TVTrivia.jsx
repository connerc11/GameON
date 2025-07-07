import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVTrivia.css';
import Leaderboard from './Leaderboard';
import { getToken, getUsername } from '../utils/auth';
import { apiFetch } from '../utils/api';

export default function TVTrivia() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  const nonRankedMode = sessionStorage.getItem('nonRankedMode') === 'true';
  const isSignedIn = !!getToken();

  // Redirect to login if not signed in
  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    apiFetch('/api/tvtrivia')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load TV trivia questions');
        setLoading(false);
      });
  }, []);

  const handleSelect = (qIdx, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: answer }));
  };

  const handleNext = () => {
    if (selectedAnswers[current] === questions[current].correct_answer) {
      setScore((s) => s + 1);
    }
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrent(0);
    setLeaderboard([]);
  };

  // Submit score and update leaderboard
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
        setLeaderboard(data.leaderboard);
      } else {
        alert(data.message || 'Error submitting score');
      }
    } catch (err) {
      alert('Error submitting score');
    }
  }

  useEffect(() => {
    if (showResults && isSignedIn && !nonRankedMode && getUsername()) {
      submitScore('tvtrivia', score, getToken());
    }
    // eslint-disable-next-line
  }, [showResults]);

  if (loading) return <div className="tvtrivia-loading">Loading...</div>;
  if (error) return <div className="tvtrivia-error">{error}</div>;
  if (!questions.length) return <div className="tvtrivia-error">No questions found.</div>;

  // After finishing the game, show a button to go to the leaderboard page
  if (showResults) {
    return (
      <div style={{ background: '#18181b', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
        <button className="tvtrivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
        <div style={{ maxWidth: 540, margin: '40px auto', background: '#23232a', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1px solid #333', padding: 28 }}>
          <h1 className="tvtrivia-title" style={{ color: '#fbbf24', fontSize: '2.2rem', marginBottom: 10, fontWeight: 900, letterSpacing: 2 }}>TV Trivia</h1>
          <h2>Your Score: {score}</h2>
          <button
            className="tvtrivia-next-btn"
            style={{ marginTop: 20, background: '#42b983', color: '#fff', fontWeight: 600 }}
            onClick={() => navigate('/tvtrivia-leaderboard')}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const answers = [...q.incorrect_answers, q.correct_answer].sort();

  return (
    <div style={{ background: '#18181b', minHeight: '100vh', minWidth: '100vw', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      <button className="tvtrivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
      <div style={{ maxWidth: 540, margin: '40px auto', background: '#23232a', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1px solid #333', padding: 28 }}>
        <h1 className="tvtrivia-title" style={{ color: '#fbbf24', fontSize: '2.2rem', marginBottom: 10, fontWeight: 900, letterSpacing: 2 }}>TV Trivia</h1>
        <h2 className="tvtrivia-progress" style={{ color: '#fbbf24', fontSize: '1.1rem', marginBottom: 24 }}>Question {current + 1} of {questions.length}</h2>
        <div className="tvtrivia-question" style={{ color: '#fff', fontSize: '1.3rem', marginBottom: 28, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: q.question }} />
        <ul className="tvtrivia-answers">
          {answers.map((a, i) => (
            <li key={i} className="tvtrivia-answer-item">
              <input
                type="radio"
                id={`q${current}-a${i}`}
                name={`question${current}`}
                checked={selectedAnswers[current] === a}
                onChange={() => handleSelect(current, a)}
                className="tvtrivia-radio"
              />
              <label 
                htmlFor={`q${current}-a${i}`} 
                className="tvtrivia-label" 
                style={{ 
                  color: '#e0e0e0', 
                  backgroundColor: selectedAnswers[current] === a ? '#fbbf24' : 'rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                  display: 'block',
                  padding: '12px 16px',
                  borderRadius: 8,
                  marginBottom: 8,
                  transition: 'all 0.2s'
                }}
                dangerouslySetInnerHTML={{ __html: a }} 
              />
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 10 }}>
          {current > 0 && (
            <button
              className="tvtrivia-next-btn"
              onClick={() => setCurrent((c) => c - 1)}
              style={{ background: '#fff', color: '#e67e22', border: '2px solid #e67e22' }}
            >
              &larr; Previous
            </button>
          )}
          <button
            className="tvtrivia-next-btn"
            onClick={handleNext}
            disabled={selectedAnswers[current] == null}
          >
            {current === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
