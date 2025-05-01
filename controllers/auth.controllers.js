const { authenticateUser } = require('../models/auth.models');

exports.loginUser = async (req, res, next) => {
  const { user } = req.body;
  console.log(user);

  try {
    const loggedInUser = await authenticateUser(user);
    res.status(200).send({ user: loggedInUser });
  } catch (err) {
    next(err);
  }
};
