exports.logger = (req, res, next) => {
  const { method, url } = req;
  // console.log(`Received a ${method} request on ${url} at ${Date.now()}`);
  next();
};
