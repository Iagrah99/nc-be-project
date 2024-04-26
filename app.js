const express = require('express');
const apiRouter = require('./routes/api-router');
const { notFoundError, customError, psqlError, internalServerError, } = require('./error-handling');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.all('*', notFoundError);
app.use(customError);
app.use(psqlError);
app.use(internalServerError);

module.exports = app;
