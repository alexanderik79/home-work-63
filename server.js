const express = require('express');
const session = require('express-session');
const users = require('./data/users');
const passport = require('./middleware/passport-config');
const ensureAuthenticated = require('./middleware/auth-check');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'passport-secret-key',
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

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).send('User already exists');
  }
  users.push({ id: Date.now(), email, password });
  console.log(`[REGISTER] New user: ${email}`);
  res.send('Registration successful');
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
