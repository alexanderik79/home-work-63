const express = require('express');
const session = require('express-session');
require('dotenv').config();
const mongoose = require('./db/mongoose');
const User = require('./models/User');
const passport = require('./middleware/passport-config');
const ensureAuthenticated = require('./middleware/auth-check');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({ email, password });
    await newUser.save();

    console.log(`[REGISTER] New user: ${email}`);
    res.send('Registration successful');
  } catch (err) {
    console.error('[REGISTER] Error:', err);
    res.status(500).send('Registration failed');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/protected',
  failureRedirect: '/login-failed'
}));

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send('Logout error');
    res.redirect('/login.html');
  });
});

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send(`<h1>Protected Page</h1><p>Welcome, ${req.user.email}</p><a href="/logout">Logout</a>`);
});

app.get('/login-failed', (req, res) => {
  res.send('Login failed. <a href="/login.html">Try again</a>');
});

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/register.html', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
