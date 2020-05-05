const {
  fetchArticleByArticleId,
  updateVotesById,
} = require("../models/articles.models");

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleByArticleId(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchVotesById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateVotesById(article_id, inc_votes)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
