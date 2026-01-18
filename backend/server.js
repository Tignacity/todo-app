require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Task = require('./models/task.model');
console.log('Task model loaded successfully');

console.log('MONGO_URI is:', process.env.MONGO_URI)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to connect
app.use(express.json()); // Parses JSON requests

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.status(201).json(task);
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { done: req.body.done },
    { new: true }
  );
  res.json(task);
});

// DELETE one task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

// DELETE all tasks
app.delete('/api/tasks', async (req, res) => {
  await Task.deleteMany({});
  res.json({ message: 'All tasks deleted' });
});


// Health Check
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});