const mongoose = require('mongoose');
const DB_URL = 'mongodb+srv://inkarakan:Samsung08@cluster0.ia2l0.mongodb.net/online-shop?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));