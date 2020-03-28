const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../../models/User');

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('public/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { name, username, password, email } = req.body;
    let hashPassword;

    if (password) {
      const saltRouds = 10;
      const salt = bcrypt.genSaltSync(saltRouds);
      hashPassword = bcrypt.hashSync(password, salt);
    }

    const newUser = new Users({ name, username, password: hashPassword, email });
    await newUser.save();
    
    res.redirect('/auth/login');
  } catch (error) {
    console.log(error)

    if (error.message.includes('required')) {
      res.render('public/signup', { errorMessage: 'Por favor, preencha todos os campos' });
      return;
    }

    if (error.message.includes('username')) {
      res.render('public/signup', { errorMessage: 'Usuário já cadastrado. Por favor escolha outro nome de usuário' });
      return;
    }

    if (error.message.includes('email')) {
      res.render('public/signup', { errorMessage: 'Email já cadastrado. Por favor insira outro email' });
      return;
    }
  }
});

router.get('/login', (req, res) => {
  console.log(req.session)
  res.render('public/login');
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('public/login', { errorMessage: 'Por favor, preencha todos os campos' });
      return;
    }

    const user = await Users.findOne({ username });

    if (!user) {
      res.render('public/login', { errorMessage: 'Usuário ou senha incorretos' });
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      res.render('public/login', { errorMessage: 'Usuário ou senha incorretos' });
      return;
    }

    req.session.loggedUser = user;
    res.redirect('/task');
  } catch (error) {
    throw new Error(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/auth/login');
  });
})

module.exports = router;