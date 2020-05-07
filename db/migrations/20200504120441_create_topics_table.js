exports.up = function (connection) {
  return connection.schema.createTable("topics", (topicsTable) => {
    topicsTable.text("slug").primary().unique();
    topicsTable.text("description");
  });
};

exports.down = function (connection) {
  return connection.schema.dropTable("topics");
};
