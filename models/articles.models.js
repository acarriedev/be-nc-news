const { connection } = require("../db/connection");

const fetchAllArticles = () => {
  // return connection.select("*").from("articles");
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy("created_at", "desc");
};

const fetchArticleByArticleId = (article_id, inc_votes) => {
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
