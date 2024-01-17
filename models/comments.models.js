const db = require('../db/connection');

exports.fetchCommentsByArticleId = async (id, sort_by = 'created_at') => {
  const comments = await db.query(
    `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} DESC`,
    [id]
  );

  if (!comments.rows.length) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  console.log(comments.rows[0]);
  return comments.rows;
};
