const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateVotesById,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleByArticleId(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateVotesById(article_id, inc_votes)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
