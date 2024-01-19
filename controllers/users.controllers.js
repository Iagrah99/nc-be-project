const { fetchUsersData } = require('../models/users.models');

exports.getUsers = async (req, res, next) => {
  const users = await fetchUsersData();
  res.status(200).send({ users });
};
