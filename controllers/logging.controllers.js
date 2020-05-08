exports.logger = (req, res, next) => {
  const { method, url } = req;
  if (process.env.NODE_ENV !== "test") {
    console.log(`Received a ${method} request on ${url} at ${Date.now()}`);
  }
  next();
};
