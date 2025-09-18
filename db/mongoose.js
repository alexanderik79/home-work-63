require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const MONGO_URI = process.env.MONGO_URI;

const db = mongoose.connection;

db.on('connected', () => {
  console.log('[MongoDB] Connected to Atlas');
});

db.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err);
});

module.exports = mongoose;
