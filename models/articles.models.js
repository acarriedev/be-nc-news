const { connection } = require("../db/connection");

const fetchArticleByArticleId = (article_id) => {
  return connection
    .select("articles.*")
    .count("comments.comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .first();
};

module.exports = { fetchArticleByArticleId };
