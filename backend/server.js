const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const familyMemberRoutes = require('./routes/familyMembers');
const familyNewsRoutes = require('./routes/familyNews');
const familyDiagramRoutes = require('./routes/familyDiagram');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.send('Tarombo API is running');
});

// Middleware
app.use('/api/family-members/update-positions', cors());

app.use(cors({
  origin: 'https://tarombo-sinaga.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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