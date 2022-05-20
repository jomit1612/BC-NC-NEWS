exports.handleCustomErrors1 =
  ("/*",
  (req, res, next) => {
    res.status(404).send({ msg: "not found" });
  });
exports.hanlePsqlErrors = (err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};
exports.handleCustomErrors2 = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
};

exports.handleInternalServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
};
