const db = require('../db/connection');

exports.checkUserExists = async (username) => {
  const userExistsQuery = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  if (!userExistsQuery.rows.length) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return userExistsQuery.rows[0];
};
