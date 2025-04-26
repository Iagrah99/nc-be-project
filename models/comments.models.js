const db = require('../db/connection');
const { checkIdExists } = require('../utils//checkIdExists');
const { checkUserExists } = require('../utils/checkUserExists');

exports.fetchCommentsByArticleId = async (id, sort_by = 'created_at') => {
  const idIsValid = [];

  idIsValid.push(await checkIdExists(id));

  const comments = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} DESC`,
    [id]
  );

  if (!comments.rows.length && !idIsValid.length) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return comments.rows;
};

exports.insertCommentByArticleId = async (username, body, article_id) => {
  await checkUserExists(username);
  await checkIdExists(article_id);

  if (!body || !username || !article_id) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  const insertCommentQuery = await db.query(
    `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
    [article_id, username, body]
  );

  return insertCommentQuery.rows[0];
};

exports.deleteCommentById = async (comment_id) => {
  const deleteCommentQuery = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;
  `,
    [comment_id]
  );

  if (!deleteCommentQuery.rowCount) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return;
};

exports.patchCommentById = async (comment_id, inc_votes, body) => {
  const updateFields = [];
  const queryValues = [];
  let valueIdx = 1;

  if (inc_votes !== undefined) {
    updateFields.push(`votes = votes + $${valueIdx++}`);
    queryValues.push(inc_votes);
  }
  if (body !== undefined) {
    updateFields.push(`body = $${valueIdx++}`);
    queryValues.push(body);
  }

  if (updateFields.length === 0) {
    throw { status: 400, msg: 'No valid fields to update' };
  }

  queryValues.push(comment_id);

  const queryStr = `
    UPDATE comments
    SET ${updateFields.join(', ')}
    WHERE comment_id = $${valueIdx}
    RETURNING *;
  `;

  const { rows } = await db.query(queryStr, queryValues);

  if (rows.length === 0) {
    throw { status: 404, msg: 'Comment not found' };
  }

  return rows[0];
};
