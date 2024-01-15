const { fetchEndpointsData } = require('../models/api.model');

exports.getEndpoints = (req, res, next) => {
  const endpoints = fetchEndpointsData();
  res.status(200).send(endpoints).catch(next);
};
