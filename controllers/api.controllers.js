const { fetchAPIEndPoints } = require("../models/api.models");

exports.getAPIEndPoints = (req, res, next) => {
  fetchAPIEndPoints((err, api) => {
    if (err) next(err);
    else {
      res.send({ api });
    }
  });
};
