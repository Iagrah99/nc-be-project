const db = require('../db/connection');
const { fetchTopicsData } = require('./topics.models');

exports.fetchArticleById = async (id) => {
  const articles = await db.query(
    `
      SELECT articles.article_id, title, topic, articles.body, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles
      LEFT JOIN comments on articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `,
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
  order_by = 'DESC',
  limit = 12,
  p = 1
) => {
  const queryParameters = [];

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
                ON articles.article_id = comments.article_id`;

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

  if (request.query.p) {
    p = parseInt(request.query.p);

    if (!Number.isInteger(p) || p < 1) {
      return Promise.reject({
        status: 400,
        msg: 'Bad request: Invalid page number specified',
      });
    }
  }

  if (request.query.limit) {
    limit = parseInt(request.query.limit, 10);

    if (!Number.isInteger(limit) || limit < 1) {
      return Promise.reject({
        status: 400,
        msg: 'Bad request: Invalid limit number specified',
      });
    }
  }

  const offset = (p - 1) * limit;

  const validTopics = (await fetchTopicsData()).map((topic) => topic.slug);

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

  query += ` ORDER BY ${sort_by} ${order_by.toUpperCase()}`;
  query += ` LIMIT ${limit} OFFSET ${offset};`;

  // Now that topic filter is known, run a matching total count query
  let countQuery = `SELECT COUNT(*) FROM articles`;
  if (request.query.topic) {
    countQuery += ` WHERE topic = $1`; // use same $1 as above
  }

  const totalCountResult = await db.query(countQuery, queryParameters);
  const total_count = parseInt(totalCountResult.rows[0].count);

  // Fetch paginated articles
  const articlesData = await db.query(query, queryParameters);

  return { articles: articlesData.rows, total_count };
};

exports.patchArticleById = async (
  article_id,
  inc_votes = 0,
  article_img_url,
  article_body,
  title,
  topic
) => {
  if (inc_votes) {
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
  }

  if (article_img_url) {
    const updatedArticleQuery = await db.query(
      `UPDATE articles SET article_img_url = $1 WHERE article_id = $2 RETURNING *;`,
      [article_img_url, article_id]
    );

    if (!updatedArticleQuery.rows[0]) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }

    return updatedArticleQuery.rows[0];
  }

  if (article_body) {
    const updatedArticleQuery = await db.query(
      `UPDATE articles SET body = $1 WHERE article_id = $2 RETURNING *;`,
      [article_body, article_id]
    );

    if (!updatedArticleQuery.rows[0]) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }

    return updatedArticleQuery.rows[0];
  }

  if (title) {
    const updatedArticleQuery = await db.query(
      `UPDATE articles SET title = $1 WHERE article_id = $2 RETURNING *;`,
      [title, article_id]
    );

    if (!updatedArticleQuery.rows[0]) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }

    return updatedArticleQuery.rows[0];
  }

  if (topic) {
    const updatedArticleQuery = await db.query(
      `UPDATE articles SET topic = $1 WHERE article_id = $2 RETURNING *;`,
      [topic, article_id]
    );

    if (!updatedArticleQuery.rows[0]) {
      return Promise.reject({ status: 404, msg: 'Not found' });
    }

    return updatedArticleQuery.rows[0];
  }
};

exports.postArticle = async (
  author,
  title,
  body,
  topic,
  article_img_url = 'https://i.ibb.co/60VdM4xv/Untitled-design.png'
) => {
  const userExistsQuery = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [author]
  );

  const validTopics = (await fetchTopicsData()).map((topic) => {
    return topic.slug;
  });

  if (
    !author ||
    !title ||
    !body ||
    !topic ||
    !userExistsQuery.rows.length ||
    !validTopics.includes(topic)
  ) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  const insertArticleQuery = await db.query(
    `
    INSERT INTO articles 
      (author, title, body, topic, article_img_url)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *;`,
    [author, title, body, topic, article_img_url]
  );

  const newArticleId = insertArticleQuery.rows[0].article_id;

  const newArticle = await this.fetchArticleById(newArticleId);

  return newArticle;
};

exports.removeArticleById = async (article_id) => {
  // First, delete associated comments
  const deleteCommentsResult = await db.query(
    `DELETE FROM comments WHERE article_id = $1;`,
    [article_id]
  );

  // Then, delete the article
  const deleteArticleResult = await db.query(
    `DELETE FROM articles WHERE article_id = $1;`,
    [article_id]
  );

  // Check if article was found and deleted
  if (deleteArticleResult.rowCount === 0) {
    return Promise.reject({ status: 404, msg: 'Article not found' });
  }

  return;
};
