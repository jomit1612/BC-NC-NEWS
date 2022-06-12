const res = require("express/lib/response");
const db = require("../db/connection");

exports.checkIfArticleIdExists = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [id])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.fetchComments = (id) => {
  return db
    .query("SELECT comments.* FROM comments WHERE comments.article_id=$1", [id])
    .then((results) => {
      return results.rows;
    });
};
exports.addComment = (body, id) => {
  return db
    .query(
      "INSERT INTO comments(author,body,article_id)VALUES($1,$2,$3) RETURNING *",
      [body.username, body.body, id]
    )
    .then((results) => {
      return results.rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *", [comment_id])
    .then((results) => {
      console.log(results.rows.length);
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else return results;
    });
};
