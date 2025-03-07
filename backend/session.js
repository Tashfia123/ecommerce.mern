const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');

// Create an instance of express
const app = express();
const port = 5000;

// In-memory users (for demonstration, you should use a database like MongoDB)
const users = [];

// Use body-parser to parse JSON data
app.use(bodyParser.json());

// Set up session middleware
app.use(session({
  secret: 'secretKey', // Secret key used for signing the session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // `secure: false` for non-HTTPS connections, set `true` in production for HTTPS
}));

// Passport configuration
passport.use(new LocalStrategy(
  (username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  }
));

// Serialize and deserialize the user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = users.find(u => u.username === username);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Register route (for demonstration purposes)
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered successfully');
});

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Protected route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send('Welcome, ' + req.user.username);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error during logout');
    }
    res.status(200).send('Logged out successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
