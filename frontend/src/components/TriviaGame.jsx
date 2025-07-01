import React, { useEffect, useState } from 'react';

export default function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/trivia')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;
  if (!questions.length) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>No questions found.</div>;

  if (showResults) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Trivia Game Results</h1>
        <h2>Your Score: {score} / {questions.length}</h2>
        <button onClick={handleRestart} style={{ padding: '10px 30px', fontSize: '1.2rem', marginTop: 20 }}>Restart</button>
        <ol style={{ textAlign: 'left', maxWidth: 600, margin: '30px auto 0' }}>
          {questions.map((q, idx) => {
            const isCorrect = selectedAnswers[idx] === q.correct_answer;
            return (
              <li key={idx} style={{ marginBottom: 20 }}>
                <div dangerouslySetInnerHTML={{ __html: q.question }} />
                <div>
                  Your answer: <span style={{ color: isCorrect ? 'green' : 'red' }} dangerouslySetInnerHTML={{ __html: selectedAnswers[idx] || 'No answer' }} />
                  {!isCorrect && (
                    <span> | Correct: <span style={{ color: 'green' }} dangerouslySetInnerHTML={{ __html: q.correct_answer }} /></span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const q = questions[current];
  const answers = [...q.incorrect_answers, q.correct_answer].sort();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Trivia Game</h1>
      <h2>Question {current + 1} of {questions.length}</h2>
      <div style={{ margin: '30px auto', maxWidth: 600, textAlign: 'left' }}>
        <div dangerouslySetInnerHTML={{ __html: q.question }} style={{ marginBottom: 20 }} />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {answers.map((a, i) => (
            <li key={i} style={{ margin: '12px 0', display: 'flex', alignItems: 'center' }}>
              <input
                type="radio"
                id={`q${current}-a${i}`}
                name={`question${current}`}
                checked={selectedAnswers[current] === a}
                onChange={() => handleSelect(current, a)}
                style={{ marginRight: 10 }}
              />
              <label htmlFor={`q${current}-a${i}`} style={{ cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: a }} />
            </li>
          ))}
        </ul>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[current] == null}
          style={{ padding: '10px 30px', fontSize: '1.2rem', marginTop: 20 }}
        >
          {current === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
