const res = require("express/lib/response");
const {
  fetchArticleById,
  updateArticle,
  fetchArticles,
  fetchComments,
  checkIfArticleIdExists,
  addComment,
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

exports.getComments = (req, res, next) => {
  Promise.all([
    checkIfArticleIdExists(req.params.article_id),
    fetchComments(req.params.article_id),
  ])
    .then(([, comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComment = (req, res, next) => {
  console.log(req.body);
  addComment(req.body, req.params.article_id)
    .then((results) => {
      console.log(results);
      res.status(201).send({ results });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
