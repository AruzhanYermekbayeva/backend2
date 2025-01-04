const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost/clothingStoreDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && user.password === password) {
    req.session.userId = user._id;  // Store the user's ID in session
    res.redirect('/index');
  } else {
    res.redirect('/login');
  }
});

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.send('Welcome to your profile!');
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
