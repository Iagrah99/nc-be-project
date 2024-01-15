const db = require('../db/connection');

exports.fetchTopicsData = async () => {
  const topicsData = await db.query('SELECT * FROM topics');
  return topicsData.rows;
};
