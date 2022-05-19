const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query(
      "SELECT articles.*,COUNT(comments.comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id;",
      [id]
    )
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
exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,COUNT(comments.comment_id) ::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
    )
    .then((results) => {
      return results.rows;
    });
};
