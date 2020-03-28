const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const publicRoutes = require('./routes/public/publicRoutes');
const authRoutes = require('./routes/public/authRoutes');
const taskRoutes = require('./routes/private/taskRoutes');
const subTaskRoutes = require('./routes/private/subTaskRoutes');

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

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'basic-auth-secret',
  cookie: { maxAge: 60000000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
}));

// public routes
app.use('/', publicRoutes);
app.use('/auth', authRoutes);

// private route middleware
app.use((req, res, next) => {
  if (req.session.loggedUser) {
    next();
    return;
  }

  res.redirect('/auth/login');
});

// private routes
app.use('/task', taskRoutes);
app.use('/sub-task', subTaskRoutes);

app.listen(3000, () => console.log('Task Manager Server Rodando na Porta 3000'));
