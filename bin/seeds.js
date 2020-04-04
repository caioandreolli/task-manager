const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose
  .connect(
    'mongodb://localhost/task-manager',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log('Connected with database'))
  .catch(err => {
    throw new Error(err);
  });

  const salt = 10;
  const saltRounds = bcrypt.genSaltSync(salt);
  const hashPassword = bcrypt.hashSync('12345', saltRounds);
  

  const newUser = {
    name: 'Adriana Saty',
    username: 'admin',
    password: hashPassword,
    email: 'dri@adriana.com.br',
    role: 'admin',
  };

 User.create(new User(newUser))
  .then(user => {
    console.log(user);
    mongoose.connection.close();
  })
  .catch(err => {
    throw new Error(err);
  })
