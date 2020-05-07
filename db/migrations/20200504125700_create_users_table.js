exports.up = function (connection) {
  console.log("creating users table...");

  return connection.schema.createTable("users", (usersTable) => {
    usersTable.text("username").primary().unique();
    usersTable.text("avatar_url");
    usersTable.text("name");
  });
};

exports.down = function (connection) {
  console.log("removing users table...");

  return connection.schema.dropTable("users");
};
