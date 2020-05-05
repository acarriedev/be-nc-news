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

describe("app", () => {
  test("status: 404 responds with 'Resource not found.' if page doesn't exist", () => {
    return request(app)
      .get("/incorrect_path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Resource not found.");
      });
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

      test("INVALID METHODS", () => {
        const invalidMethods = ["patch", "post", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            .post("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Method not allowed.");
            });
        });

        return Promise.all(requests);
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

          test("status: 400 responds with an error when given am invalid username", () => {
            return request(app)
              .get("/api/users/invalid_user")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request.");
              });
          });
        });

        test("INVALID METHODS", () => {
          const invalidMethods = ["patch", "post", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              .post("/api/users/:username")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          });

          return Promise.all(requests);
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

          test("status: 400 responds with an error when article_id is not an integer", () => {
            return request(app)
              .get("/api/articles/first_article")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(
                  "Bad request: Invalid input. Must be integer."
                );
              });
          });

          test("status: 400 responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/909")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request.");
              });
          });
        });

        test("INVALID METHODS", () => {
          const invalidMethods = ["post", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              .post("/api/articles/:article_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          });

          return Promise.all(requests);
        });
      });
    });
  });
});
