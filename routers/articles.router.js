const articlesRouter = require("express").Router();
const {
  getArticleByArticleId,
  patchVotesById,
} = require("../controllers/articles.controllers");
const { handle405s } = require("../controllers/errors.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchVotesById)
  .all(handle405s);

module.exports = articlesRouter;
