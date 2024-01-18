const db = require('../db/connection');
const { checkIdExists } = require('../utils/checkIdExists');

exports.fetchArticleById = async (id) => {
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

exports.fetchArticlesData = async (sort_by = 'created_at') => {
  const articlesData = await db.query(
    `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${sort_by} DESC;`
  );

  return articlesData.rows;
};

exports.patchArticleById = async (article_id, inc_votes) => {
  await checkIdExists(article_id);

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  const updatedArticleQuery = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [inc_votes, article_id]
  );

  return updatedArticleQuery.rows[0];
};
