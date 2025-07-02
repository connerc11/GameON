import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { getToken, getUsername } from '../utils/auth';

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
    fetch('http://localhost:3001/api/trivia')
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
      fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ game: 'triviagame', score })
      });
    }
  }, [showResults]);

  if (loading) return <div className="trivia-loading">Loading...</div>;
  if (error) return <div className="trivia-error">{error}</div>;
  if (!questions.length) return <div className="trivia-error">No questions found.</div>;

  if (showResults) {
    return (
      <div className="trivia-container">
        <button className="trivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
        <div className="trivia-results-card">
          <h1>🎉 Trivia Game Results</h1>
          <h2>Your Score: <span className="trivia-score">{score} / {questions.length}</span></h2>
          {(!nonRankedMode && isSignedIn) ? <Leaderboard game="triviagame" /> : null}
          <button className="trivia-restart-btn" onClick={handleRestart}>Restart</button>
          <ol className="trivia-results-list">
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correct_answer;
              return (
                <li key={idx} className="trivia-result-item">
                  <div dangerouslySetInnerHTML={{ __html: q.question }} />
                  <div>
                    Your answer: <span style={{ color: isCorrect ? '#42b983' : '#e74c3c', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: selectedAnswers[idx] || 'No answer' }} />
                    {!isCorrect && (
                      <span> | Correct: <span style={{ color: '#42b983', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: q.correct_answer }} /></span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const answers = [...q.incorrect_answers, q.correct_answer].sort();

  return (
    <div className="trivia-container">
      <button className="trivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
      <div className="trivia-card">
        <h1 className="trivia-title">Trivia Game</h1>
        <h2 className="trivia-progress">Question {current + 1} of {questions.length}</h2>
        <div className="trivia-question" dangerouslySetInnerHTML={{ __html: q.question }} />
        <ul className="trivia-answers">
          {answers.map((a, i) => (
            <li key={i} className="trivia-answer-item">
              <input
                type="radio"
                id={`q${current}-a${i}`}
                name={`question${current}`}
                checked={selectedAnswers[current] === a}
                onChange={() => handleSelect(current, a)}
                className="trivia-radio"
              />
              <label htmlFor={`q${current}-a${i}`} className="trivia-label" dangerouslySetInnerHTML={{ __html: a }} />
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 10 }}>
          {current > 0 && (
            <button
              className="trivia-next-btn"
              onClick={() => setCurrent((c) => c - 1)}
              style={{ background: '#fff', color: '#42b983', border: '2px solid #42b983' }}
            >
              &larr; Previous
            </button>
          )}
          <button
            className="trivia-next-btn"
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
