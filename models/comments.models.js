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
    .orderBy(sort_by, order);
  // .then((commentsRows) => {
  //   if (commentsRows.length === 0) {
  //     return Promise.reject({
  //       status: 404,
  //       msg: "Article not found.",
  //     });
  //   } else return commentsRows;
  // });
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

const updateCommentVotesById = (comment_id, inc_votes) => {
  if (!inc_votes)
    return Promise.reject({ status: 400, msg: "Bad request: Missing input." });
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then((comment) => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found.",
        });
      } else return comment[0];
    });
};

const removeCommentById = (comment_id) => {
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id })
    .del()
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found.",
        });
      }
    });
};

module.exports = {
  fetchCommentsByArticleId,
  createCommentByArticleId,
  updateCommentVotesById,
  removeCommentById,
};
