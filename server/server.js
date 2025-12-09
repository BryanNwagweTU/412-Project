// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // allow front end to call API
app.use(express.json()); // parse JSON body


// GET /messages/:course — returns all messages for a course
app.get('/messages/:course', async (req, res) => {
  const { course } = req.params;
  try {
    const result = await query(
      'SELECT id, user_name, text, course, timestamp FROM messages WHERE course = $1 ORDER BY timestamp DESC',
      [course]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /messages — inserts a new message
app.post('/messages', async (req, res) => {
  const { user_name, text, course } = req.body;
  if (!user_name || !text || !course) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await query(
      'INSERT INTO messages (user_name, text, course) VALUES ($1, $2, $3) RETURNING id, user_name, text, course, timestamp',
      [user_name, text, course]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
