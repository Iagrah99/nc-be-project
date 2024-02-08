const db = require('../db/connection');
const { fetchTopicsData } = require('./topics.models');

exports.fetchArticleById = async (id) => {
  const articles = await db.query(
    `SELECT articles.article_id, title, topic, articles.body, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles
    LEFT JOIN comments on articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
    [id]
  );
  const article = articles.rows[0];

  if (!article) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return article;
};

exports.fetchArticlesData = async (
  request,
  sort_by = 'created_at',
  order_by = 'DESC'
) => {
  let query = `SELECT
                articles.article_id,
                title,
                topic,
                articles.author,
                articles.created_at,
                articles.votes,
                articles.article_img_url,
                COUNT(comments.article_id)::INT AS comment_count
              FROM articles
                LEFT JOIN comments
                on articles.article_id = comments.article_id`;

  const queryParameters = [];
  const validSortByQueries = [
    'article_id',
    'title',
    'topic',
    'author',
    'votes',
    'article_img_url',
    'comment_count',
    'created_at',
  ];
  const validOrderByQueries = ['desc', 'asc'];

  const validTopics = (await fetchTopicsData()).map((topic) => {
    return topic.slug;
  });

  if (request.query.topic) {
    const topicExists = validTopics.includes(request.query.topic);
    if (topicExists) {
      query += ` WHERE topic = $1`;
      queryParameters.push(request.query.topic);
    } else {
      return Promise.reject({ status: 404, msg: 'Topic not found' });
    }
  }

  if (request.query.sort_by) {
    const queryIsValid = validSortByQueries.includes(request.query.sort_by);
    if (queryIsValid) {
      sort_by = request.query.sort_by;
    } else {
      return Promise.reject({ status: 400, msg: 'Invalid sort by query' });
    }
  }

  query += ` GROUP BY articles.article_id`;

  if (request.query.order_by) {
    const orderByIsValid = validOrderByQueries.includes(request.query.order_by);
    if (orderByIsValid) {
      order_by = request.query.order_by;
    } else {
      return Promise.reject({ status: 400, msg: 'Invalid order by query' });
    }
  }

  query += ` ORDER BY ${sort_by} ${order_by.toUpperCase()};`;

  const articlesData = await db.query(query, queryParameters);

  return articlesData.rows;
};

exports.patchArticleById = async (article_id, inc_votes = 0) => {
  if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  const updatedArticleQuery = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
    [inc_votes, article_id]
  );

  if (!updatedArticleQuery.rows[0]) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return updatedArticleQuery.rows[0];
};
