const articlesRouter = require('express').Router();
const {
  getArticleById,
  getArticles,
  addArticles,
  updateArticleById,
  deleteArticleById,
} = require('../controllers/articles.controllers');
const {
  getCommentsByArticleId,
  addCommentByArticleId,
} = require('../controllers/comments.controllers');

articlesRouter.route('/').get(getArticles).post(addArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId);

module.exports = articlesRouter;
