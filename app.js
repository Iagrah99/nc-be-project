const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controller');
const {
  notFoundError,
  customError,
  psqlError,
  internalServerError,
} = require('./error-handling');
const {
  getArticleById,
  getArticles,
  updateArticleById,
} = require('./controllers/articles.controllers');
const {
  getCommentsByArticleId,
  addCommentByArticleId,
} = require('./controllers/comments.controllers');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', addCommentByArticleId);
app.patch('/api/articles/:article_id', updateArticleById);

app.all('*', notFoundError);
app.use(customError);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
