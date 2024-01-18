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
