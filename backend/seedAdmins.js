const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const adminUsers = [
  { username: 'Hayoloh', password: 'JanganLiat' },
  { username: 'Hayoloh', password: 'JanganLiat' },
  { username: 'Hayoloh', password: 'JanganLiat' }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
  
    for (const admin of adminUsers) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await User.findOneAndUpdate(
        { username: admin.username },
        { username: admin.username, password: hashedPassword },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Admin user ${admin.username} created or updated`);
    }
  
    console.log('Admin users seeded successfully');
    mongoose.connection.close();
  })
  .catch((err) => console.error('MongoDB connection error:', err));
