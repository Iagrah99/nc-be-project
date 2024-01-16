const db = require('../db/connection');

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
    `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY ${sort_by} DESC`
  );

  const commentsData = await db.query(`SELECT article_id FROM comments`);
  const idCount = {};

  commentsData.rows.forEach((comment) => {
    idCount[comment.article_id] = 0;
  });
  commentsData.rows.forEach((comment) => {
    idCount[comment.article_id]++;
  });

  articlesData.rows.forEach((article) => {
    article.comment_count = idCount[article.article_id];
    if (!article.comment_count) article.comment_count = 0;
  });

  return articlesData.rows;
};
