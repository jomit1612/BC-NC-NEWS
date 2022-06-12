const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status :200,returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBe(3);
      });
  });
  test("status 404, returns not found when passed a route that does not exist", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("status(200),responds with the matching article", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
  test("status(404), returns not found when passed a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/20000000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("status(400), returns bad request when passed an invalid id type", () => {
    return request(app)
      .get("/api/articles/blue")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("status(200),updated object is returned", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 101 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 201,
          })
        );
      });
  });
  test("status(400), returns bad request when passed a malformed or missing body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: {} })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("status(400),returns bad request when passes something that is not an integer", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "votes" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("status(404),returns not found when passed a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/234234234")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("status(400),returns bad request when passed an invalid id type", () => {
    return request(app)
      .patch("/api/articles/green")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status(200),responds with matching article with comment count added", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: expect.any(Number),
          })
        );
      });
  });
});
describe("getAPI/users", () => {
  test("satus (200) returns an array of user objects with the property username", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBe(4);
      });
  });
});

describe("GET api/articles,", () => {
  test("Status (200) returns an array of article objects with comment count added and with the articles sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
});
describe("GET api/articles/:article_id/comments", () => {
  test("status(200) returns an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
          expect(body.comments.length).toBe(11);
        });
      });
  });
  test("status(404) returned not found when passed a valid id that does not exist", () => {
    return request(app)
      .get("/api/articles/222222/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("status(400) returned bad request when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/blue/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("Status(200) returns an empty array when comments do not exist", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});
describe("Post /api/articles/:article_id/comments", () => {
  test("status(201),responds with posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "interesting stuff",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.results).toEqual({
          comment_id: 19,
          body: "interesting stuff",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status(400) bad request when malformed body", () => {
    const newComment = { body: "interesting stuff" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status(400) bad request when passed failing schema", () => {
    const newComment = { body: 55 };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status(400) bad request when passed invalid username", () => {
    const newComment = { username: 22, body: 55 };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("status(400) bad request when empty body send", () => {
    const newComment = { username: 22, body: "" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("Delete /api/comments/:comment_id", () => {
  test("status(204), responds with an empty response body", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404,not found when deleting something that does not exist", () => {
    return request(app)
      .delete("/api/comments/12323123")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("400, bad request when passed an invalid id type", () => {
    return request(app)
      .delete("/api/comments/notanid")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
