const articlesRouter = require("express").Router();
const {
  getArticleByArticleId,
} = require("../controllers/articles.controllers");
const { handle405s } = require("../controllers/errors.controllers");

articlesRouter.route("/:article_id").get(getArticleByArticleId).all(handle405s);

module.exports = articlesRouter;
