import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TVTrivia.css';

export default function TVTrivia() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/tvtrivia')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
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
  };

  if (loading) return <div className="tvtrivia-loading">Loading...</div>;
  if (error) return <div className="tvtrivia-error">{error}</div>;
  if (!questions.length) return <div className="tvtrivia-error">No questions found.</div>;

  if (showResults) {
    return (
      <div className="tvtrivia-container">
        <button className="tvtrivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
        <div className="tvtrivia-results-card">
          <h1>📺 TV Trivia Results</h1>
          <h2>Your Score: <span className="tvtrivia-score">{score} / {questions.length}</span></h2>
          <button className="tvtrivia-restart-btn" onClick={handleRestart}>Restart</button>
          <ol className="tvtrivia-results-list">
            {questions.map((q, idx) => {
              const isCorrect = selectedAnswers[idx] === q.correct_answer;
              return (
                <li key={idx} className="tvtrivia-result-item">
                  <div dangerouslySetInnerHTML={{ __html: q.question }} />
                  <div>
                    Your answer: <span style={{ color: isCorrect ? '#e67e22' : '#e74c3c', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: selectedAnswers[idx] || 'No answer' }} />
                    {!isCorrect && (
                      <span> | Correct: <span style={{ color: '#e67e22', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: q.correct_answer }} /></span>
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
    <div className="tvtrivia-container">
      <button className="tvtrivia-home-btn" onClick={() => navigate('/')}>🏠 Home</button>
      <div className="tvtrivia-card">
        <h1 className="tvtrivia-title">TV Trivia</h1>
        <h2 className="tvtrivia-progress">Question {current + 1} of {questions.length}</h2>
        <div className="tvtrivia-question" dangerouslySetInnerHTML={{ __html: q.question }} />
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
              <label htmlFor={`q${current}-a${i}`} className="tvtrivia-label" dangerouslySetInnerHTML={{ __html: a }} />
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
