exports.notFoundError = (req, res) => {
  res.status(404).send({ msg: 'Endpoint not found' });
};

exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.psqlError = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request' });
  } else next(err);
};

exports.internalServerError = (err, req, res, next) => {
  // console.log(err, '<<< error handler 500');
  res.status(500).send({ msg: 'Internal server error' });
};
