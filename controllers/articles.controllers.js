const { fetchArticleByArticleId } = require("../models/articles.models");

exports.getArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleByArticleId(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
