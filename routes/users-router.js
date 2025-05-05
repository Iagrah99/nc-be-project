const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  getArticlesByUsername,
  updateUserIsLoggedIn,
} = require('../controllers/users.controllers');

usersRouter.route('/').get(getUsers);

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .patch(updateUserIsLoggedIn);

usersRouter.route('/:username/articles').get(getArticlesByUsername);

module.exports = usersRouter;
