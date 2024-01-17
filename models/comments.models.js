const db = require('../db/connection');
const { checkIdExists } = require('../utils//checkIdExists');

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
