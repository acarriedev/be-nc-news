exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Resource not found." });
};

exports.errorLogger = (err, req, res, next) => {
  const { method, url } = req;
  console.log(`error occurred on ${method} ${url} at ${Date.now()}`);
  next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const codes = { 42703: { status: 400, msg: "bad request" } };
  if (err.code in codes) {
    const { status, msg } = codes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error." });
};
