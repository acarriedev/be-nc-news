const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticleVotesById,
} = require("../models/articles.models");
const { fetchUserByUserName } = require("../models/users.models");
const { fetchTopicBySlug } = require("../models/topics.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  const queries = [fetchAllArticles(sort_by, order, author, topic)];
  if (author) queries.push(fetchUserByUserName(author));
  if (topic) queries.push(fetchTopicBySlug(topic));

  Promise.all(queries)
    .then(([articles]) => {
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
