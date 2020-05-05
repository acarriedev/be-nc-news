const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const { handleInternalErrors } = require("./controllers/errors.controllers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleInternalErrors);

module.exports = app;
