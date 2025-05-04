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
    const sessionEnded = await endUserSession(user);
    res.status(200).send(sessionEnded);
  } catch (err) {
    next(err);
  }
};
