const { fetchTopicsData } = require('../models/topics.models');

exports.getTopics = async (req, res, next) => {
  const topics = await fetchTopicsData();
  res.status(200).send(topics);
};
