const { connection } = require("../db/connection");

const fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

const fetchTopicBySlug = (slug) => {
  return connection
    .select("*")
    .from("topics")
    .where({ slug })
    .then((topic) => {
      if (topic.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic not found." });
      } else {
        return topic[0];
      }
    });
};

module.exports = { fetchAllTopics, fetchTopicBySlug };
