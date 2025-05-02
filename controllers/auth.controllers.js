const { authenticateUser, endUserSession } = require('../models/auth.models');

exports.loginUser = async (req, res, next) => {
  const { user } = req.body;

  try {
    const loggedInUser = await authenticateUser(user);
    res.status(200).send({ user: loggedInUser });
  } catch (err) {
    next(err);
  }
};

exports.logoutUser = async (req, res, next) => {
  const { user } = req.body;

  try {
    await endUserSession(user);
    res.status(200).send({ msg: 'You have been successfully logged out' });
  } catch (err) {
    next(err);
  }
};
