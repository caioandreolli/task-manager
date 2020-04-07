const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Users = require('../../../models/User');

const router = express.Router();

// local strategy signup
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

// local strategy login
router.get('/login', (req, res) => {
  res.render('public/login', { errorMessage: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  }),
  (req, res) => {
    const redirect = {
      member: '/task',
      admin: '/admin/dashboard',
    };
    const { role } = req.user;

    res.redirect(redirect[role]);
  },
);

// faccebook strategy login
router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate(
    'facebook',
    { failureRedirect: '/login' }
  ),
  (req, res) => {
    res.redirect('/task');
  },
);

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
})

module.exports = router;