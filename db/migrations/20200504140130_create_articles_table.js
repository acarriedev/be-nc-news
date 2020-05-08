exports.up = function (connection) {
  return connection.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.text("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.text("topic").notNullable();
    articlesTable.foreign("topic").references("topics.slug");
    articlesTable.text("author").notNullable();
    articlesTable.foreign("author").references("users.username");
    articlesTable.timestamp("created_at").defaultTo(connection.fn.now());
  });
};

exports.down = function (connection) {
  return connection.schema.dropTable("articles");
};
