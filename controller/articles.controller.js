const res = require("express/lib/response");
const {
  fetchArticleById,
  updateArticle,
  fetchArticles,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { articles_id } = req.params;
  updateArticle(articles_id, req.body.inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
