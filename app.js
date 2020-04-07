require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const mongoose = require('./middlewares/mongoose');
const PassportMiddlewares = require('./middlewares/passport');

const appRoutes = require('./routes/routes');

const app = express();
const passport = new PassportMiddlewares(app);

app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

passport.serializeUser();
passport.applyLocalStrategy();
passport.applyFacebookStrategy();

app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: +process.env.SESSION_COOKIE_MAX_AGE },
    
  })
);

passport.applySessionInitialize();

app.use('/', appRoutes);

mongoose.startDbConnection();

app.listen(
  process.env.PORT,
  () => console.log(`Task Manager Server Rodando na Porta ${process.env.PORT} | ENV: ${process.env.ENV}`),
);
