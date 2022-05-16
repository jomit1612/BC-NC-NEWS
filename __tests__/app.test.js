const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200,returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics[0]).toHaveProperty("slug");
        expect(body.topics[0]).toHaveProperty("description");
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
  test("status 404, returns not found when passed a route that does not exist", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
});
