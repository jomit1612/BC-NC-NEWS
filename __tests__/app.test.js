const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

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
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
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
      .send({ inc_votes: {} })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("status(404),returns not found when passed a valid id that does not exist", () => {
    return request(app)
      .patch("/api/articles/234234234")
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
