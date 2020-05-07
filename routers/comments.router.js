const commentsRouter = require("express").Router();
const {
  patchCommentVotesById,
} = require("../controllers/comments.controllers");
const { handle405s } = require("../controllers/errors.controllers");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotesById)
  .all(handle405s);

module.exports = commentsRouter;
