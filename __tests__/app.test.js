const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const topics = require("../db/data/test-data/topics");
const { forEach } = require("../db/data/test-data/articles");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status 200,returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log(body.topics);
        body.topics.forEach((element) => {
          expect(element).toHaveProperty("slug");
        });
        body.topics.forEach((element) => {
          expect(element).toHaveProperty("description");
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
        expect(res.body.msg).toBe("Not found");
      });
  });
});
