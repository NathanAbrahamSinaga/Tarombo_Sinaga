// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const familyMemberRoutes = require('./routes/familyMembers');
const familyNewsRoutes = require('./routes/familyNews');
const familyDiagramRoutes = require('./routes/familyDiagram');

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.send('Tarombo API is running');
});

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://tarombo-sinaga.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/family-members', familyMemberRoutes);
app.use('/api/family-news', familyNewsRoutes);
app.use('/api/family-diagram', familyDiagramRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
