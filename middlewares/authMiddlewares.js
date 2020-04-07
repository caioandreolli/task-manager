class AuthMiddlewares {
  constructor() {
    this.roles = require('../enums/roles.enum');
  }

  authRequiredMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
      return;
    }
  
    res.redirect('/auth/login');
  };

  validateAdminUser = (req, res, next) => {
    const { user } = req;

    if (user.role === this.roles.ADMIN) {
      next();
      return;
    }

    res.redirect('/auth/login');
  };
}

module.exports = new AuthMiddlewares();
