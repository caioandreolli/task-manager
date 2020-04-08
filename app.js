require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('./models/User');
const publicRoutes = require('./routes/public/publicRoutes');
const authRoutes = require('./routes/public/authRoutes');
const apiRoutes = require('./routes/public/apiRoutes');
const taskRoutes = require('./routes/private/taskRoutes');
const subTaskRoutes = require('./routes/private/subTaskRoutes');
const adminRoutes = require('./routes/private/adminRoutes');

const app = express();

mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  )
  .then(() => console.log(`Conectado ao Banco ${process.env.MONGODB_URI}`))
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

passport.use(new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, callback) => {
    User.findOne({ username })
      .then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return callback(null, false, { message: 'Nome de usuário ou senha incorretos' });
        }
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  }
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.HOST_URL}/auth/facebook/callback`,
  },
  (accessToken, refreshToken, profile, cb) => {
    const { id, displayName } = profile;

    User.findOrCreate(
      { facebookId: id },
      {
        name: displayName,
        username: `FacebookUser-${id}`,
        password: 'qualquer-senha-encriptada',
        email: `facebook-user-${id}@task-manager.com.br`,
      },
      (err, user) => {
        return cb(err, user);
      }
    );
  }
));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: +process.env.SESSION_COOKIE_MAX_AGE },
    
  })
);

app.use(passport.initialize());
app.use(passport.session());

// public routes
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

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

app.listen(
  process.env.PORT,
  () => console.log(`Task Manager Server Rodando na Porta ${process.env.PORT} | ENV: ${process.env.ENV}`),
);
