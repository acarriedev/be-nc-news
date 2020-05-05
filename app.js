const express = require("express");
const app = express();
const { logger } = require("./controllers/logging.controllers");
const apiRouter = require("./routers/api.router");
const {
  send404,
  errorLogger,
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());
app.use(logger);

app.use("/api", apiRouter);
app.use(send404);

app.use(errorLogger);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
