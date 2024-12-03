const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));  // Add this line to serve static files like HTML, CSS

// Database connection
const db = mysql.createConnection({
  host: 'two-tier.chkm4aqo8i42.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'todo_app',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// API endpoint for root
app.get('/', (req, res) => {
  res.send('Welcome to the Todo App!');
});

// API endpoint to get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching todos: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// API endpoint to add a new todo
app.post('/todos', (req, res) => {
  const task = req.body.task;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }

  // Insert the todo with the current timestamp
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) {
      console.error('Failed to add todo: ', err);
      return res.status(500).json({ error: 'Failed to add todo' });
    }
    res.status(201).json({ id: result.insertId, task });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


