const {
  fetchUsersData,
  fetchUserByUsername,
  fetchArticlesByUsername,
  patchUserIsLoggedIn,
} = require('../models/users.models');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsersData();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getArticlesByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { userArticles } = await fetchArticlesByUsername(req, username);

    res.status(200).send({ articles: userArticles });
  } catch (err) {
    next(err);
  }
};

exports.updateUserIsLoggedIn = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { is_logged_in } = await patchUserIsLoggedIn(username);

    res.status(200).send({ is_logged_in });
  } catch (err) {
    next(err);
  }
};
