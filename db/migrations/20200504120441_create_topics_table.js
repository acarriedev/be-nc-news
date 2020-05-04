exports.up = function (knex) {
  console.log("creating topics table...");

  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.text("slug").primary().unique();
    topicsTable.text("description");
  });
};

exports.down = function (knex) {
  console.log("removing topics table");

  return knex.schema.dropTable("topics");
};
