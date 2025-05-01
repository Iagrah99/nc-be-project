const authRouter = require('express').Router();

const { loginUser, logoutUser } = require('../controllers/auth.controllers');

authRouter.route('/login').patch(loginUser);
authRouter.route('/logout').patch(logoutUser);

module.exports = authRouter;
