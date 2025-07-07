import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { getToken, getUsername } from '../utils/auth';
import { apiFetch } from '../utils/api';
import './trivia.css';
import './landing-basketball.css';

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
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
    apiFetch('/api/trivia')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load trivia questions');
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
  };

  useEffect(() => {
    if (showResults && isSignedIn && !nonRankedMode && getUsername()) {
      apiFetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ game: 'trivia', score })
      });
    }
  }, [showResults]);

  if (loading) return <div className="trivia-loading">Loading...</div>;
  if (error) return <div className="trivia-error">{error}</div>;
  if (!questions.length) return <div className="trivia-error">No questions found.</div>;

  if (showResults) {
    return (
      <div className="trivia-container" style={{ background: '#111', minHeight: '100vh', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', left: 24, top: 24, zIndex: 2 }}>
          <button
            className="trivia-next-btn"
            style={{ padding: '8px 18px', fontSize: '1rem', background: '#fbbf24', color: '#18181b', fontWeight: 700, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => navigate('/home')}
          >
            <span style={{ fontSize: '1.2em' }}>🏠</span> Return to Homepage
          </button>
        </div>
        <img className="trivia-sports-ball" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Sports Ball" style={{ width: 48, height: 48, position: 'absolute', left: 32, top: 90, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)', zIndex: 1 }} />
        <div className="trivia-card" style={{ maxWidth: 500, margin: '40px auto', background: '#18181b', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1.5px solid #fbbf24', padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
          <h1 className="trivia-title" style={{ color: '#fbbf24', fontSize: '2.2rem', textAlign: 'center', margin: 0, letterSpacing: 1, fontWeight: 900 }}>Sports Trivia</h1>
          <h2 style={{ color: '#ffe066', fontSize: '1.3rem', margin: '24px 0 14px 0', textAlign: 'center', fontWeight: 700 }}>Your Score: <span className="trivia-score">{score} / {questions.length}</span></h2>
          <button
            className="trivia-next-btn"
            style={{ marginTop: 20, background: '#fbbf24', color: '#18181b', fontWeight: 700, borderRadius: 10, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer', minWidth: 180, margin: 2 }}
            onClick={() => navigate('/triviagame-leaderboard')}
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
    <div className="trivia-container" style={{ background: '#111', minHeight: '100vh', color: '#fff', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'absolute', left: 24, top: 24, zIndex: 2 }}>
        <button
          className="trivia-next-btn"
          style={{ padding: '8px 18px', fontSize: '1rem', background: '#fbbf24', color: '#18181b', fontWeight: 700, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => navigate('/home')}
        >
          <span style={{ fontSize: '1.2em' }}>🏠</span> Return to Homepage
        </button>
      </div>
      <img className="trivia-sports-ball" src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png" alt="Sports Ball" style={{ width: 48, height: 48, position: 'absolute', left: 32, top: 90, animation: 'ball-bounce 1.6s infinite cubic-bezier(.68,-0.55,.27,1.55)', zIndex: 1 }} />
      <div className="trivia-card" style={{ maxWidth: 500, margin: '40px auto', background: '#18181b', borderRadius: 16, boxShadow: '0 2px 16px #0008', color: '#fff', border: '1.5px solid #fbbf24', padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <h1 className="trivia-title" style={{ color: '#fbbf24', fontSize: '2.2rem', textAlign: 'center', margin: 0, letterSpacing: 1, fontWeight: 900 }}>Sports Trivia</h1>
        <h2 style={{ color: '#ffe066', fontSize: '1.3rem', margin: '24px 0 14px 0', textAlign: 'center', fontWeight: 700 }}>Question {current + 1} of {questions.length}</h2>
        <div className="trivia-question" style={{ color: '#fff', fontSize: '1.15rem', marginBottom: 18, textAlign: 'center', fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: q.question }} />
        <ul className="trivia-answers" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: 0, listStyle: 'none', marginBottom: 24 }}>
          {answers.map((a, i) => (
            <li key={i} className="trivia-answer-item" style={{ width: '100%' }}>
              <input
                type="radio"
                id={`q${current}-a${i}`}
                name={`question${current}`}
                checked={selectedAnswers[current] === a}
                onChange={() => handleSelect(current, a)}
                className="trivia-radio"
              />
              <label htmlFor={`q${current}-a${i}`} className="trivia-label" style={{ display: 'block', background: '#ffe066', color: '#18181b', borderRadius: 8, padding: '12px 18px', fontWeight: 700, fontSize: 17, cursor: 'pointer', border: selectedAnswers[current] === a ? '2px solid #fbbf24' : '2px solid #ffe066', boxShadow: selectedAnswers[current] === a ? '0 2px 8px #fbbf2422' : '0 2px 8px #ffe06622', marginBottom: 6 }} dangerouslySetInnerHTML={{ __html: a }} />
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 10 }}>
          {current > 0 && (
            <button
              className="trivia-next-btn"
              onClick={() => setCurrent((c) => c - 1)}
              style={{ background: '#fff', color: '#00c3ff', border: '2px solid #00c3ff' }}
            >
              &larr; Previous
            </button>
          )}
          <button
            className="trivia-next-btn"
            onClick={handleNext}
            disabled={selectedAnswers[current] == null}
            style={{ background: '#fbbf24', color: '#18181b', fontWeight: 700, borderRadius: 10, fontSize: 18, border: 'none', boxShadow: '0 2px 8px #fbbf2422', cursor: 'pointer', minWidth: 120, margin: 2 }}
          >
            {current === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
