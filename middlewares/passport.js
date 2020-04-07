require('dotenv').config();

class PassportMiddlewares {
  constructor(app) {
    this.bcrypt = require('bcrypt');
    this.passport = require('passport');
    this.LocalStrategy = require('passport-local').Strategy;
    this.FacebookStrategy = require('passport-facebook').Strategy;
    this.User = require('../models/User');
    this.app = app;
  }

  serializeUser = () => {
    this.passport.serializeUser((user, callback) => {
      callback(null, user._id);
    });
    
    this.passport.deserializeUser((id, callback) => {
      this.User.findById(id)
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    });
  };

  applyLocalStrategy = () => {
    this.passport.use(new this.LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, callback) => {
        this.User.findOne({ username })
          .then(user => {
            if (!user || !this.bcrypt.compareSync(password, user.password)) {
              return callback(null, false, { message: 'Nome de usuário ou senha incorretos' });
            }
            callback(null, user);
          })
          .catch(error => {
            callback(error);
          });
      }
    ));
  };

  applyFacebookStrategy = () => {
    this.passport.use(new this.FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.HOST_URL}/auth/facebook/callback`,
      },
      (accessToken, refreshToken, profile, cb) => {
        const { id, displayName } = profile;
    
        this.User.findOrCreate(
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
  };

  applySessionInitialize = () => {
    this.app.use(this.passport.initialize());
    this.app.use(this.passport.session());
  };
}

module.exports = PassportMiddlewares;
