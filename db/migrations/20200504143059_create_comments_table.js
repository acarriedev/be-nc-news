exports.up = function (connection) {
  console.log("creating comments table...");

  return connection.schema.createTable("comments", (commentsTable) => {
    commentsTable.increments("comment_id").primary();
    commentsTable.text("author");
    commentsTable.foreign("author").references("users.username");
    commentsTable.integer("article_id");
    commentsTable.foreign("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(connection.fn.now());
    commentsTable.text("body");
  });
};

exports.down = function (connection) {
  console.log("removing comments table...");

  return connection.schema.dropTable("comments");
};
