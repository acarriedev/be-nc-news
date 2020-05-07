const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticleVotesById,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  // find the user here and IF the user doesn't exist then reject the promise here rather than in the models. This is more of a 404. change the test to suit.

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

exports.patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotesById(article_id, inc_votes)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
