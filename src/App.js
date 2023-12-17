import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Hae kaikki kysymykset alussa
    setLoading(true);
    axios.get('http://localhost:3000/questions')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Kysymysten hakeminen epäonnistui', error);
        setError('Kysymysten hakeminen epäonnistui.Yritä uudelleen.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlay = () => {
    setLoading(true);
    axios.post('http://localhost:3000/play')
      .then(response => console.log('Peliä pelataan:', response.data))
      .catch(error => console.error('Pelin pelaaminen epäonnistui', error))
      .finally(() => setLoading(false));
  };

  const handleAddQuestion = () => {
    setLoading(true);
    axios.post('http://localhost:3000/questions', { question: newQuestion, answer: newAnswer })
      .then(response => {
        console.log('Uusi kysymys lisätty:', response.data);
      
        setNewQuestion('');
        setNewAnswer('');
        
        updateQuestions();
      })
      .catch(error => {
        console.error('Kysymyksen lisääminen epäonnistui', error);
        setError('Kysymyksen lisääminen epäonnistui. Yritä uudelleen.');
      })
      .finally(() => setLoading(false));
  };

  const updateQuestions = () => {
    // Päivittää kysymyksen kun olet lisännyt kysymyksen tai pelannut peliä.
    setLoading(true);
    axios.get('http://localhost:3000/questions')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Kysymysten hakeminen epäonnistui', error);
        setError('Kysymysten hakeminen epäonnistui, yritä uudelleen.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Peli</h1>
      <button onClick={handlePlay} disabled={loading}>Pelaa peliä</button>

      <h2>Lisää uusi kysymys</h2>
      <input type="text" placeholder="Kysymys" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} />
      <input type="text" placeholder="Vastaus" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} />
      <button onClick={handleAddQuestion} disabled={loading}>Lisää kysymys</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Kysymykset</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {questions.map(q => (
            <li key={q.id}>{q.question} - {q.answer}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;