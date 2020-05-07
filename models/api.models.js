const fs = require("fs");

const fetchAPIEndPoints = (cb) => {
  fs.readFile("./endpoints.json", "utf8", (err, endPointsData) => {
    if (err) cb({ status: 404, msg: "End points not found." });
    else {
      cb(null, JSON.parse(endPointsData));
    }
  });
};

module.exports = { fetchAPIEndPoints };
