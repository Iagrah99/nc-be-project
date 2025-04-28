const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  getArticlesByUsername,
} = require('../controllers/users.controllers');

usersRouter.route('/').get(getUsers);

usersRouter.route('/:username').get(getUserByUsername);

usersRouter.route('/:username/articles').get(getArticlesByUsername);

module.exports = usersRouter;
