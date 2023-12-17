// server.js
const cors = require('cors')
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Luo MySQL-yhteys
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Yhdistä MySQL-tietokantaan
db.connect((err) => {
  if (err) {
    console.error('Tietokantayhteyden virhe:', err);
  } else {
    console.log('Tietokantaan yhdistetty');
  }
});


db.query(`CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT,
  answer TEXT
)`, (err) => {
  if (err) console.error('Taulun luonnin virhe:', err);
  else console.log('Taulu luotu tai jo olemassa');
});

app.use(bodyParser.json());

// Lisää uusi kysymys
app.post('/questions', (req, res) => {
  const { question, answer } = req.body;
  const sql = 'INSERT INTO questions (question, answer) VALUES (?, ?)';
  db.query(sql, [question, answer], (err, result) => {
    if (err) res.status(500).json({ error: 'Kysymyksen lisääminen epäonnistui' });
    else res.json({ message: 'Kysymys lisätty onnistuneesti' });
  });
});

// Hae kaikki kysymykset
app.get('/questions', (req, res) => {
  const sql = 'SELECT * FROM questions';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ error: 'Kysymysten hakeminen epäonnistui' });
    else res.json(results);
  });
});

// Pelaa peliä
app.post('/play', (req, res) => {
  const sql = 'SELECT * FROM questions ORDER BY RAND() LIMIT 3';
  db.query(sql, (err, results) => {
    if (err) res.status(500).json({ error: 'Kysymysten hakeminen epäonnistui' });
    else res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});