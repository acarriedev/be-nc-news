const { connection } = require("../db/connection");

const fetchCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  return connection
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order)
    .then((commentsRows) => {
      if (commentsRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found.",
        });
      } else return commentsRows;
    });
};

const createCommentByArticleId = (article_id, author, body) => {
  return connection
    .insert({ author, article_id, body })
    .into("comments")
    .returning("*")
    .then((commentRows) => {
      return commentRows[0];
    });
};

module.exports = { fetchCommentsByArticleId, createCommentByArticleId };