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

// DON'T FORGET TO UNCOMMENT LOGGERS WHEN FINISHED

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
        const invalidMethods = ["patch", "post", "put", "delete"];
        const requests = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
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
          const invalidMethods = ["patch", "post", "put", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/users/:username")
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
      describe("/", () => {
        test("status: 200 responds with an array of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(Array.isArray(articles)).toBe(true);
              expect(articles.length).toBe(12);
            });
        });

        test("status: 200 each article has the properites that match with articles columns", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
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
        });

        test("status: 200 expect articles to be sorted by created_at latest", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("created_at", {
                descending: true,
              });
            });
        });

        test("status: 200 each article has a comment_count propery which has the number of comments related to that article as its value", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.hasOwnProperty("comment_count")).toBe(true);
              });
              expect(articles[0].comment_count).toBe("13");
            });
        });

        describe("queries", () => {
          describe("sort_by & order", () => {
            describe("sort_by=created_at", () => {
              test("status: 200 default sorted order is by created_at latest", () => {
                return request(app)
                  .get("/api/articles")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 created_at can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=author", () => {
              test("status: 200 query sort_by=author sorted author in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=author")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("author", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 author query can be ordered alphabetically by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=author&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("author", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=title", () => {
              test("status: 200 query sort_by=title sorts by title alphabetically in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=title")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("title", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 title query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=title&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("title", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=votes", () => {
              test("status: 200 query sort_by=votes sorted votes in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=votes")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("votes", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 votes query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=votes&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("votes", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=topic", () => {
              test("status: 200 query sort_by=topic sorts by topic alphabetically in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=topic")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("topic", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 topic query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=topic&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("topic", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=article_id", () => {
              test("status: 200 query sort_by=article_id sorts by article_id in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=article_id")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("article_id", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 article_id query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=article_id&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("article_id", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=comment_count", () => {
              test("status: 200 query sort_by=comment_count sorts by comment_count in descending order", () => {
                return request(app)
                  .get("/api/articles?sort_by=comment_count")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("comment_count", {
                      descending: true,
                      coerce: true,
                    });
                  });
              });

              test("status: 200 comment_count query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles?sort_by=comment_count&order=asc")
                  .expect(200)
                  .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("comment_count", {
                      ascending: true,
                      coerce: true,
                    });
                  });
              });
            });

            test("status: 400 responds with an error when given invalid query", () => {
              return request(app)
                .get("/api/articles?sort_by=invalid_property")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request.");
                });
            });
          });

          describe("author", () => {
            test("status: 200 author=:author returns specified author object", () => {
              return request(app)
                .get("/api/articles?author=butter_bridge")
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles.length).toBe(3);

                  articles.forEach((article) => {
                    expect(article.author).toBe("butter_bridge");
                  });
                });
            });
          });
        });

        test("INVALID METHODS", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          });

          return Promise.all(requests);
        });
      });

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

          test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/909")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found.");
              });
          });
        });

        describe("PATCH", () => {
          test("status: 200 responds with a single article object", () => {
            return request(app)
              .patch("/api/articles/2")
              .send({ inc_votes: 1 })
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

          test("status: 200 update article object has votes property increased by in_votes amount if in_votes is positive", () => {
            return request(app)
              .patch("/api/articles/3")
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).toBe(10);
              });
          });

          test("status: 200 update article object has votes property decreased by in_votes amount if in_votes is negative", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -1 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).toBe(99);
              });
          });

          test("status: 400 responds with an error when inc_vote is not an integer", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "Not an Integer!" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(
                  "Bad request: Invalid input. Must be integer."
                );
              });
          });

          test("status: 400 responds with an error when article_id is not an integer", () => {
            return request(app)
              .patch("/api/articles/not_an_int")
              .send({ inc_votes: 20 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(
                  "Bad request: Invalid input. Must be integer."
                );
              });
          });

          test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
              .patch("/api/articles/909")
              .send({ inc_votes: 1 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found.");
              });
          });
        });

        test("INVALID METHODS", () => {
          const invalidMethods = ["put", "post", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/:article_id")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Method not allowed.");
              });
          });

          return Promise.all(requests);
        });
      });

      describe("/:article_id/comments", () => {
        describe("GET", () => {
          test("status: 200 responds with an array of comment objects for the given article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(13);
              });
          });

          test("status: 200 each comment has the properties which match comment columns", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                comments.forEach((comment) => {
                  expect(Object.keys(comment)).toEqual(
                    expect.arrayContaining([
                      "comment_id",
                      "votes",
                      "created_at",
                      "author",
                      "body",
                    ])
                  );
                });
              });
          });

          test("status: 400 responds with an error when article_id is not an integer", () => {
            return request(app)
              .get("/api/articles/first_article/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(
                  "Bad request: Invalid input. Must be integer."
                );
              });
          });

          test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/909/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Article not found.");
              });
          });

          describe("queries", () => {
            describe("sort_by=created_at", () => {
              test("status: 200 default sorted order is by created_at latest", () => {
                return request(app)
                  .get("/api/articles/1/comments")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("created_at", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 created_at can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles/1/comments?order=asc")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("created_at", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=comment_id", () => {
              test("status: 200 query sort_by=comment_id sorted comment_id in descending order", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=comment_id")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("comment_id", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 comment_id query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("comment_id", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=author", () => {
              test("status: 200 query sort_by=author sorted author in descending order", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=author")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("author", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 author query can be ordered alphabetically by asc", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=author&order=asc")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("author", {
                      ascending: true,
                    });
                  });
              });
            });

            describe("sort_by=votes", () => {
              test("status: 200 query sort_by=votes sorted votes in descending order", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=votes")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("votes", {
                      descending: true,
                    });
                  });
              });

              test("status: 200 votes query can be ordered by asc", () => {
                return request(app)
                  .get("/api/articles/1/comments?sort_by=votes&order=asc")
                  .expect(200)
                  .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("votes", {
                      ascending: true,
                    });
                  });
              });
            });

            test("status: 400 responds with an error when given invalid query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=invalid_property")
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Bad request.");
                });
            });
          });
        });

        describe("POST", () => {
          test("status: 201 responds with posted comment", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "This is a great article! (test comment)",
              })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment.author).toBe("butter_bridge");
                expect(comment.body).toBe(
                  "This is a great article! (test comment)"
                );
              });
          });

          test("status: 201 responded comment has properties relating to comment columns", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "This is a great article! (test comment)",
              })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(Object.keys(comment)).toEqual(
                  expect.arrayContaining([
                    "comment_id",
                    "author",
                    "article_id",
                    "body",
                    "created_at",
                    "votes",
                  ])
                );
              });
          });

          test("status: 400 responds with an error when article_id is not an integer", () => {
            return request(app)
              .post("/api/articles/first_article/comments")
              .send({
                username: "butter_bridge",
                body: "This is a great article! (test comment)",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe(
                  "Bad request: Invalid input. Must be integer."
                );
              });
          });

          test("status: 404 responds with an error when given an article_id that doesn't exist", () => {
            return request(app)
              .post("/api/articles/909/comments")
              .send({
                username: "butter_bridge",
                body: "This is a great article! (test comment)",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request.");
              });
          });

          test("status: 400 responds with an error when username doesn't exist", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "not_a_user",
                body: "This is a great article! (test comment)",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request.");
              });
          });

          test("status: 400 responds with an error when username is in an invalid format", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: 1,
                body: "This is a great article! (test comment)",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad request.");
              });
          });
        });

        test("INVALID METHODS", () => {
          const invalidMethods = ["put", "patch", "delete"];
          const requests = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/:article_id/comments")
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
