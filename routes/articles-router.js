const articlesRouter = require('express').Router();
const { getArticleById, getArticles, addArticles, updateArticleById } = require('../controllers/articles.controllers');
const { getCommentsByArticleId, addCommentByArticleId } = require("../controllers/comments.controllers");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(addArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId);

module.exports = articlesRouter;