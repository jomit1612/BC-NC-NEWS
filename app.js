const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const {
  getArticleById,
  patchArticle,
} = require("./controller/articles.controller");
const {
  handleCustomErrors1,
  hanlePsqlErrors,
  handleCustomErrors2,
  handleInternalServerErrors,
} = require("./controller/errors.controllers");
const { getUsers } = require("./controller/users.controller");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.patch("/api/articles/:articles_id", patchArticle);

app.use(handleCustomErrors1);
app.use(hanlePsqlErrors);

app.use(handleCustomErrors2);

app.use(handleInternalServerErrors);
module.exports = app;
