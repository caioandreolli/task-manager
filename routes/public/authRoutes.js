const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
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
  res.render('public/login', { errorMessage: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/task',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
})

module.exports = router;