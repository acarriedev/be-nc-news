const { connection } = require("../db/connection");

const fetchUserByUserName = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .first();
};

module.exports = { fetchUserByUserName };
