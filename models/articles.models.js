const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [id])
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return results.rows[0];
    });
};
exports.updateArticle = (articles_id, votesToAdd) => {
  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *`,
      [votesToAdd, articles_id]
    )
    .then((results) => {
      return results.rows[0];
    });
};