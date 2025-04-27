const commentsRouter = require('express').Router();
const {
  removeCommentById,
  updateCommentById,
  getCommentsByUser,
} = require('../controllers/comments.controllers');

commentsRouter
  .route('/:comment_id')
  .delete(removeCommentById)
  .patch(updateCommentById);

commentsRouter.route('/:username').get(getCommentsByUser);

module.exports = commentsRouter;
