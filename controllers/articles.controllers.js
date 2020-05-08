const {
  fetchAllArticles,
  fetchArticleByArticleId,
  updateArticleVotesById,
} = require("../models/articles.models");
const { fetchUserByUserName } = require("../models/users.models");
const { fetchAllTopics } = require("../models/topics.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  if (author) {
    fetchUserByUserName(author)
      .then((user) => {
        if (user.length === 0) {
          return Promise.reject({ status: 404, msg: "User not found" });
        } else {
          return fetchAllArticles(sort_by, order, author, topic);
        }
      })
      .then((articles) => {
        res.send({ articles });
      })
      .catch(next);
  } else if (topic) {
    fetchAllTopics()
      .then((topics) => {
        const validTopic = topics.some((topicItem) => topicItem.slug === topic);

        if (!validTopic) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        } else {
          return fetchAllArticles(sort_by, order, author, topic);
        }
      })
      .then((articles) => {
        res.send({ articles });
      })
      .catch(next);
  } else {
    fetchAllArticles(sort_by, order, author, topic)
      .then((articles) => {
        res.send({ articles });
      })
      .catch(next);
  }
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
