require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Task = require('./models/Task');
console.log('Task model loaded successfully');

console.log('MONGO_URI is:', process.env.MONGO_URI)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to connect
app.use(express.json()); // Parses JSON requests

// Health Check
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo({ text: req.body.text });
  await newTodo.save();
  res.status(201).json(newTodo);
});

// Connect to MongoDB (we'll add this next)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});