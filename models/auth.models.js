const db = require('../db/connection');
const bcrypt = require('bcrypt');

exports.authenticateUser = async ({ username, password }) => {
  const fetchLoggedInUserDetails = (
    await db.query(
      'UPDATE users SET is_logged_in = $1 WHERE username = $2 RETURNING *;',
      [true, username]
    )
  ).rows[0];

  if (!fetchLoggedInUserDetails) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: Incorrect username.',
    });
  }

  if (!(await bcrypt.compare(password, fetchLoggedInUserDetails.password))) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: Incorrect password.',
    });
  }

  return fetchLoggedInUserDetails;
};

exports.endUserSession = async ({ username }) => {
  const logoutSuccessfull = (
    await db.query(
      'UPDATE users SET is_logged_in = $1 WHERE username = $2 RETURNING *;',
      [false, username]
    )
  ).rowCount;

  return logoutSuccessfull;
};
