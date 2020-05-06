const { fetchAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch(next);
};