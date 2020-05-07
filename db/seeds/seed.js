const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = (connection) => {
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      return connection("topics").insert(topicData);
    })
    .then(() => {
      return connection("users").insert(userData);
    })
    .then(() => {
      const formattedArticles = formatDates(articleData);

      return connection("articles").insert(formattedArticles).returning("*");
    })
    .then((articleRows) => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articleRef);

      return connection("comments").insert(formattedComments);
    });
};
