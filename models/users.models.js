const db = require('../db/connection');
const { checkUserExists } = require('../utils/checkUserExists');

exports.fetchUsersData = async () => {
  const usersData = await db.query(
    'SELECT username, name, avatar_url, is_logged_in, date_joined FROM users;'
  );
  return usersData.rows;
};

exports.fetchUserByUsername = async (username) => {
  const userData = await db.query(
    `SELECT username, name, avatar_url, is_logged_in, date_joined FROM users
     WHERE users.username = $1;`,
    [username]
  );

  const user = userData.rows[0];

  if (!user) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return userData.rows[0];
};

exports.fetchArticlesByUsername = async (
  request,
  username,
  sort_by = 'votes',
  order_by = 'desc',
  limit = 20,
  p = 1
) => {
  let queryParameters = [];
  let whereConditions = [];

  await checkUserExists(username);

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

  const validSortByQueries = ['topic', 'votes', 'comment_count', 'created_at'];
  const validOrderByQueries = ['desc', 'asc'];

  const offset = (p - 1) * limit;

  if (typeof p !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad request.' });
  }

  if (username) {
    whereConditions.push(`articles.author = $${queryParameters.length + 1}`);
    queryParameters.push(username);
  }

  if (whereConditions.length) {
    query += ` WHERE ` + whereConditions.join(' AND ');
  }

  // Handle sorting
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

  // Total count
  let countQuery = `SELECT COUNT(*) FROM articles`;
  if (whereConditions.length) {
    countQuery += ` WHERE ` + whereConditions.join(' AND ');
  }

  const totalCountResult = await db.query(countQuery, queryParameters);
  const total_count = parseInt(totalCountResult.rows[0].count);

  // Fetch paginated articles
  const articlesData = await db.query(query, queryParameters);

  return { userArticles: articlesData.rows, total_count };
};

exports.patchUserIsLoggedIn = async (username) => {
  const refreshLoginStatusQuery = (
    await db.query(
      'UPDATE users SET is_logged_in = $1 WHERE username = $2 RETURNING is_logged_in;',
      [true, username]
    )
  ).rows[0];

  return refreshLoginStatusQuery;
};
