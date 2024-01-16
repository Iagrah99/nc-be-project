const db = require('../db/connection');

exports.fetchArticleById = async (id) => {
  console.log(id);
  const articles = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [id]
  );
  const article = articles.rows[0];

  if (!article) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return article;
};
