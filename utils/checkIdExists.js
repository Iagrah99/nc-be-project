const db = require('../db/connection');

exports.checkIdExists = async (article_id) => {
  const idExistsQuery = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );

  if (!idExistsQuery.rows.length) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return idExistsQuery.rows[0];
};
