const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const User = require('./models/User');
const publicRoutes = require('./routes/public/publicRoutes');
const authRoutes = require('./routes/public/authRoutes');
const taskRoutes = require('./routes/private/taskRoutes');
const subTaskRoutes = require('./routes/private/subTaskRoutes');
const adminRoutes = require('./routes/private/adminRoutes');

const app = express();

mongoose
  .connect(
    'mongodb://localhost/task-manager',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('Conectado ao Banco de Dados'))
  .catch((err) => {
    throw new Error(err);
  });

app.use(flash());

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, callback) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return callback(null, false, { message: 'Nome de usuário ou senha incorretos' });
          }
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'our-passport-local-strategy-app',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 5000000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// public routes
app.use('/', publicRoutes);
app.use('/auth', authRoutes);

// private route middleware
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/auth/login');
});

// private routes
app.use('/task', taskRoutes);
app.use('/sub-task', subTaskRoutes);

app.use((req, res, next) => {
  const { user } = req;

  if (user.role === 'admin') {
    next();
    return;
  }

  res.redirect('/auth/login');
});

app.use('/admin', adminRoutes);

app.listen(3000, () => console.log('Task Manager Server Rodando na Porta 3000'));
