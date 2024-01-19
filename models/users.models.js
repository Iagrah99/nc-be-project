const db = require('../db/connection');

exports.fetchUsersData = async () => {
  const usersData = await db.query('SELECT * FROM users');
  return usersData.rows;
};
