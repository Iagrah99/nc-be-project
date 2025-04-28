const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
  patchCommentById,
  fetchCommentsByUsername,
} = require('../models/comments.models');

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;

    const comments = await fetchCommentsByArticleId(article_id);
    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
};

exports.addCommentByArticleId = async (req, res, next) => {
  try {
    const username = req.body.username;
    const body = req.body.body;
    const id = req.params.article_id;
    const addedComment = await insertCommentByArticleId(username, body, id);
    res.status(201).send(addedComment);
  } catch (err) {
    next(err);
  }
};

exports.removeCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await deleteCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.updateCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes, body } = req.body;
    const updatedComment = await patchCommentById(comment_id, inc_votes, body);
    res.status(200).send({ comment: updatedComment });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sort_by, order_by } = req.query;
    const commentsByUsername = await fetchCommentsByUsername(
      username,
      sort_by,
      order_by
    );
    res.status(200).send({ comments: commentsByUsername });
  } catch (err) {
    next(err);
  }
};
