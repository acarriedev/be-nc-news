const { connection } = require("../db/connection");

const fetchAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify((query) => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad request: Invalid query.",
        });
      } else return articles;
    });
};

const fetchArticleByArticleId = (article_id) => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found.",
        });
      } else return article[0];
    });
};

const updateVotesById = (article_id, inc_votes) => {
  if (!inc_votes)
    return Promise.reject({ status: 400, msg: "Bad request: Missing input." });
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((article) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found.",
        });
      } else return article[0];
    });
};

module.exports = { fetchAllArticles, fetchArticleByArticleId, updateVotesById };
