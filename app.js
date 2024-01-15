const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/api.controller');
const { notFoundError } = require('./error-handling');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);

app.all('*', notFoundError);

module.exports = app;
