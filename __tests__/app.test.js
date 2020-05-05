process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { connection } = require("../db/connection");

beforeAll(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      test("status:200 responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(Array.isArray(topics)).toBe(true);
            expect(topics.length).toBe(3);
          });
      });

      test("status 200: each topic has slug and description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
              expect(Object.keys(topic)).toEqual(
                expect.arrayContaining(["slug", "description"])
              );
            });
          });
      });
    });
  });
});
