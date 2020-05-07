const endPointsJSON = require("../endpoints.json");

exports.getAPIEndPoints = (req, res, next) => {
  res.send(endPointsJSON);
};
