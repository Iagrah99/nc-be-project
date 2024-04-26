const db = require('../db/connection');

exports.fetchUsersData = async () => {
  const usersData = await db.query('SELECT * FROM users');
  return usersData.rows;
};

exports.fetchUserByUsername = async (username) => {
  console.log(username)

  const userData = await db.query(
    `SELECT * FROM users
     WHERE users.username = $1`,
    [username]
  );

  const user = userData.rows[0];

  if (!user) {
    return Promise.reject({ status: 404, msg: 'Not found' });
  }

  return userData.rows[0];
}
