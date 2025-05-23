const db = require('../db/connection');
const { checkUserExists } = require('../utils/checkUserExists');
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
  const whereConditions = []; // New array to hold WHERE conditions dynamically

  let query = `
    SELECT
      articles.article_id,
      title,
      topic,
      articles.body,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
  `;

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
      whereConditions.push(`topic = $${queryParameters.length + 1}`);
      queryParameters.push(request.query.topic);
    } else {
      return Promise.reject({ status: 404, msg: 'Topic not found' });
    }
  }

  if (request.query.author) {
    await checkUserExists(request.query.author);
    whereConditions.push(`articles.author = $${queryParameters.length + 1}`);
    queryParameters.push(request.query.author);
  }

  if (whereConditions.length) {
    query += ` WHERE ` + whereConditions.join(' AND ');
  }

  if (request.query.sort_by) {
    if (!validSortByQueries.includes(request.query.sort_by)) {
      return Promise.reject({ status: 400, msg: 'Invalid sort by query' });
    }
    sort_by = request.query.sort_by;
  }

  query += ` GROUP BY articles.article_id`;

  if (request.query.order_by) {
    if (!validOrderByQueries.includes(request.query.order_by)) {
      return Promise.reject({ status: 400, msg: 'Invalid order by query' });
    }
    order_by = request.query.order_by;
  }

  query += ` ORDER BY ${sort_by} ${order_by.toUpperCase()}`;
  query += ` LIMIT ${limit} OFFSET ${offset};`;

  // Total Count Query
  let countQuery = `SELECT COUNT(*) FROM articles`;
  if (whereConditions.length) {
    countQuery += ` WHERE ` + whereConditions.join(' AND ');
  }

  const totalCountResult = await db.query(countQuery, queryParameters);
  const total_count = parseInt(totalCountResult.rows[0].count);

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

  let query = 'UPDATE articles SET ';
  const queryParams = [];
  let queryIndex = 1;

  if (title) {
    query += `title = $${queryIndex}, `;
    queryParams.push(title);
    queryIndex++;
  }

  if (topic) {
    query += `topic = $${queryIndex}, `;
    queryParams.push(topic);
    queryIndex++;
  }

  if (article_img_url) {
    query += `article_img_url = $${queryIndex}, `;
    queryParams.push(article_img_url);
    queryIndex++;
  }

  if (article_body) {
    query += `body = $${queryIndex}, `;
    queryParams.push(article_body);
    queryIndex++;
  }

  if (inc_votes) {
    query += `votes = votes + $${queryIndex}, `;
    queryParams.push(inc_votes);
    queryIndex++;
  }

  query = query.slice(0, -2);

  query += ` WHERE article_id = $${queryIndex} RETURNING *;`;
  queryParams.push(article_id);

  const updatedArticle = (await db.query(query, queryParams)).rows[0];

  return updatedArticle;
};

exports.postArticle = async (author, title, body, topic, article_img_url) => {
  const userExistsQuery = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [author]
  );

  if (!article_img_url || article_img_url.trim() === '') {
    article_img_url =
      'https://res.cloudinary.com/dafsdsmus/image/upload/v1746017270/pexels-deeanacreates-1646981_k5h0rs.jpg';
  }

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
