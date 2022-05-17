const express = require("express");
const { getTopics } = require("./controller/topics.controller");
const { getArticleById } = require("./controller/articles.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});
module.exports = app;
