const {
  addComment,
  fetchComments,
  checkIfArticleIdExists,
  removeComment,
} = require("../models/comments.model");

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
  addComment(req.body, req.params.article_id)
    .then((results) => {
      res.status(201).send({ results });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  removeComment(req.params.comment_id, req.params.article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
