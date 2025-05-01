const { getEndpoints } = require('../controllers/api.controller');

const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const authRouter = require('./auth-router');

apiRouter.get('/', getEndpoints);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;
