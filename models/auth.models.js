const db = require('../db/connection');
const { checkUserExists } = require('../utils/checkUserExists');

exports.authenticateUser = async ({ username }) => {
  const fetchLoggedInUserDetails = (
    await db.query(
      'UPDATE users SET is_logged_in = $1 WHERE username = $2 RETURNING *;',
      [true, username]
    )
  ).rows[0];

  if (!fetchLoggedInUserDetails) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: User does not exist',
    });
  }

  console.log(fetchLoggedInUserDetails);

  return fetchLoggedInUserDetails;
};
