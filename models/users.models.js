const { connection } = require("../db/connection");

const fetchUserByUserName = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then((userRows) => {
      return userRows[0];
    });
};

module.exports = { fetchUserByUserName };
