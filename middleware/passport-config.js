const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../data/users'); // путь зависит от структуры

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const user = users.find(u => u.email === email);
    if (!user) return done(null, false, { message: 'User not found' });
    if (user.password !== password) return done(null, false, { message: 'Wrong password' });
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

module.exports = passport;
