const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("doesn't mutate input", () => {
    const articles = [
      {
        title: "test_book_a",
        topic: "topic_a",
        author: "user_a",
        body: "this is a test",
        created_at: 1588603837971,
      },
      {
        title: "test_book_b",
        topic: "topic_b",
        author: "user_b",
        body: "this is still a test",
        created_at: 1588603831111,
      },
    ];

    expect(formatDates(articles)).not.toBe(articles);
    expect(articles).toEqual([
      {
        title: "test_book_a",
        topic: "topic_a",
        author: "user_a",
        body: "this is a test",
        created_at: 1588603837971,
      },
      {
        title: "test_book_b",
        topic: "topic_b",
        author: "user_b",
        body: "this is still a test",
        created_at: 1588603831111,
      },
    ]);
  });

  describe("creates an SQL timestamp from the unix timestamp found a the created_at key of article object", () => {
    test("works when one article object in array", () => {
      const article = [
        {
          title: "test_book_a",
          topic: "topic_a",
          author: "user_a",
          body: "this is a test",
          created_at: 1588603837971,
        },
      ];
      const expectedResult = [
        {
          title: "test_book_a",
          topic: "topic_a",
          author: "user_a",
          body: "this is a test",
          created_at: "2020-05-04T14:50:37.971Z",
        },
      ];

      expect(formatDates(article)).toEqual(expectedResult);
    });

    test("works when multiple article objects in array", () => {
      const article = [
        {
          title: "test_book_a",
          topic: "topic_a",
          author: "user_a",
          body: "this is a test",
          created_at: 1588603837971,
        },
        {
          title: "test_book_b",
          topic: "topic_b",
          author: "user_b",
          body: "this is still a test",
          created_at: 1578603831111,
        },
        {
          title: "test_book_c",
          topic: "topic_c",
          author: "user_c",
          body: "this is yet still a test",
          created_at: 1519603831111,
        },
      ];
      const expectedResult = [
        {
          title: "test_book_a",
          topic: "topic_a",
          author: "user_a",
          body: "this is a test",
          created_at: "2020-05-04T14:50:37.971Z",
        },
        {
          title: "test_book_b",
          topic: "topic_b",
          author: "user_b",
          body: "this is still a test",
          created_at: "2020-01-09T21:03:51.111Z",
        },
        {
          title: "test_book_c",
          topic: "topic_c",
          author: "user_c",
          body: "this is yet still a test",
          created_at: "2018-02-26T00:10:31.111Z",
        },
      ];

      expect(formatDates(article)).toEqual(expectedResult);
    });
  });
});

describe("makeRefObj", () => {
  test("returns and object when passed an array", () => {
    const articlesData = [];
    const desiredKey = "";
    const desiredValue = "";

    expect(makeRefObj(articlesData, desiredKey, desiredValue)).toEqual({});
  });

  test("Does not mutate input", () => {
    const articlesData = [
      {
        article_id: 1,
        title: "article_a",
        body: "this is an article",
        votes: 11,
        topic: "topic_a",
        author: "user_a",
        created_at: "2016-08-18 13:07:52.389+01",
      },
    ];
    const desiredKey = "title";
    const desiredValue = "article_id";

    expect(makeRefObj(articlesData, desiredKey, desiredValue)).not.toBe(
      articlesData
    );
    expect(articlesData).toEqual([
      {
        article_id: 1,
        title: "article_a",
        body: "this is an article",
        votes: 11,
        topic: "topic_a",
        author: "user_a",
        created_at: "2016-08-18 13:07:52.389+01",
      },
    ]);
  });

  describe("Returns a reference object when passed an array of articles", () => {
    test("works for one article", () => {
      const articlesData = [
        {
          article_id: 1,
          title: "article_a",
          body: "this is an article",
          votes: 11,
          topic: "topic_a",
          author: "user_a",
          created_at: "2016-08-18 13:07:52.389+01",
        },
      ];
      const desiredKey = "title";
      const desiredValue = "article_id";
      const expectedValue = { article_a: 1 };

      expect(makeRefObj(articlesData, desiredKey, desiredValue)).toEqual(
        expectedValue
      );
    });

    test("Works for many articles", () => {
      const articlesData = [
        {
          article_id: 1,
          title: "article_a",
          body: "this is an article",
          votes: 11,
          topic: "topic_a",
          author: "user_a",
          created_at: "2016-08-18 13:07:52.389+01",
        },
        {
          article_id: 2,
          title: "article_b",
          body: "this is still an article",
          votes: 34,
          topic: "topic_b",
          author: "user_b",
          created_at: "2016-06-18 13:07:52.389+01",
        },
        {
          article_id: 3,
          title: "article_c",
          body: "this is yet still an article",
          votes: 64,
          topic: "topic_c",
          author: "user_c",
          created_at: "2016-07-18 13:07:52.389+01",
        },
      ];
      const desiredKey = "title";
      const desiredValue = "article_id";
      const expectedValue = { article_a: 1, article_b: 2, article_c: 3 };

      expect(makeRefObj(articlesData, desiredKey, desiredValue)).toEqual(
        expectedValue
      );
    });
  });
});

describe("formatComments", () => {
  test("returns a new empty array when passed an empty array", () => {
    const input1 = [];
    const input2 = [];

    const result = [];
    expect(formatComments(input1, input2)).toEqual(result);
  });

  test("doesn't mutuate input", () => {
    const commentsData = [
      {
        body: "this is a comment",
        belongs_to: "article_a",
        created_by: "user_a",
        votes: 16,
        created_at: 1588603837971,
      },
    ];
    const articleRef = {
      article_a: 1,
    };

    expect(formatComments(commentsData, articleRef)).not.toBe(commentsData);
    expect(commentsData).toEqual([
      {
        body: "this is a comment",
        belongs_to: "article_a",
        created_by: "user_a",
        votes: 16,
        created_at: 1588603837971,
      },
    ]);
  });
});
