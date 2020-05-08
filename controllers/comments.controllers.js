const {
  fetchCommentsByArticleId,
  createCommentByArticleId,
  updateCommentVotesById,
  removeCommentById,
} = require("../models/comments.models");
const { fetchArticleByArticleId } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchArticleByArticleId(article_id)
    .then((article) => {
      if (article) {
        return fetchCommentsByArticleId(article_id, sort_by, order);
      } else {
        return Promise.reject({ status: 404, msg: "Article not found." });
      }
    })
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  createCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchCommentVotesById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  updateCommentVotesById(comment_id, inc_votes)
    .then((comment) => {
      res.send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
