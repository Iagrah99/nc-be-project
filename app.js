const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controller');
const { notFoundError, customError, psqlError } = require('./error-handling');
const {
  getArticleById,
  getArticles,
} = require('./controllers/articles.controllers');
const {
  getCommentsByArticleId,
} = require('./controllers/comments.controllers');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('*', notFoundError);
app.use(customError);
app.use(psqlError);

module.exports = app;
