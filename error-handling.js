exports.notFoundError = (req, res) => {
  res.status(404).send({ msg: 'endpoint not found' });
};
