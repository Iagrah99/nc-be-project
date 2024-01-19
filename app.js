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
  removeCommentById,
} = require('./controllers/comments.controllers');

const { getUsers } = require('./controllers/users.controllers');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', addCommentByArticleId);
app.patch('/api/articles/:article_id', updateArticleById);
app.delete('/api/comments/:comment_id', removeCommentById);

app.all('*', notFoundError);
app.use(customError);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
