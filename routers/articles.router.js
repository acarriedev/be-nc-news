const articlesRouter = require("express").Router();
const {
  getArticleByArticleId,
  patchVotesById,
} = require("../controllers/articles.controllers");
const {
  postCommentByArticleId,
} = require("../controllers/comments.controllers");
const { handle405s } = require("../controllers/errors.controllers");

articlesRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(patchVotesById)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .all(handle405s);

module.exports = articlesRouter;
