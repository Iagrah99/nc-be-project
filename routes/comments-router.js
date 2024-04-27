const commentsRouter = require('express').Router();
const { removeCommentById, updateCommentById } = require('../controllers/comments.controllers');

commentsRouter
  .route("/:comment_id")
  .delete(removeCommentById)
  .patch(updateCommentById);

module.exports = commentsRouter;
