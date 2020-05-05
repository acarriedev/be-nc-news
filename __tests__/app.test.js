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

  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        test("status:200 responds with a single user object", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(typeof user).toBe("object");
            });
        });

        test("status:200 user has properties equal to user columns ", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user.username).toBe("butter_bridge");
              expect(user.avatar_url).toBe(
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
              );
              expect(user.name).toBe("jonny");
            });
        });
      });
    });
  });

  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET", () => {
        test("status:200 responds with a single article object", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(typeof article).toBe("object");
            });
        });

        test("status:200 article has properties equal to property columns ", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(Object.keys(article)).toEqual(
                expect.arrayContaining([
                  "author",
                  "title",
                  "article_id",
                  "body",
                  "topic",
                  "created_at",
                  "votes",
                ])
              );
            });
        });

        test("status 200: article has a comment_count which is the total count of all the comments with this article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).toBe("13");
            });
        });
      });
    });
  });
});
