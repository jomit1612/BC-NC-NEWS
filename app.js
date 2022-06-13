const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controller/topics.controller");
const {
  getArticleById,
  patchArticle,
  getArticles,
} = require("./controller/articles.controller");
const {
  handleCustomErrors1,
  hanlePsqlErrors,
  handleCustomErrors2,
  handleInternalServerErrors,
} = require("./controller/errors.controllers");
const { getUsers } = require("./controller/users.controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controller/comments.controller.js");
const { getApi } = require("./controller/api.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.get("/api", getApi);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:articles_id", patchArticle);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(handleCustomErrors1);
app.use(hanlePsqlErrors);

app.use(handleCustomErrors2);

app.use(handleInternalServerErrors);
module.exports = app;
