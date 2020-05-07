exports.up = function (connection) {
  console.log("creating topics table...");

  return connection.schema.createTable("topics", (topicsTable) => {
    topicsTable.text("slug").primary().unique();
    topicsTable.text("description");
  });
};

exports.down = function (connection) {
  console.log("removing topics table");

  return connection.schema.dropTable("topics");
};
