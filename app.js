const express = require("express");
const { getTopics } = require("./controller/topics.controller");

const app = express();

app.get("/api/topics", getTopics);
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
