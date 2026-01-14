require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('MONGO_URI is:', process.env.MONGO_URI)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to connect
app.use(express.json()); // Parses JSON requests

// Basic route to test
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Connect to MongoDB (we'll add this next)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});