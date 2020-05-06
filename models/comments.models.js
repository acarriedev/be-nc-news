const { connection } = require("../db/connection");

const createCommentByArticleId = (article_id, author, body) => {
  return connection
    .insert({ author, article_id, body })
    .into("comments")
    .returning("*")
    .then((commentRows) => {
      return commentRows[0];
    });
};

module.exports = { createCommentByArticleId };
