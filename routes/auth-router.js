const authRouter = require('express').Router();

const { loginUser } = require('../controllers/auth.controllers');

authRouter.route('/login').patch(loginUser);

module.exports = authRouter;
