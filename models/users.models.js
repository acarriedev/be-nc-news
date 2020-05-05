const { connection } = require("../db/connection");

const fetchUserByUserName = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 400, msg: "Bad request." });
      } else return user[0];
    });
};

module.exports = { fetchUserByUserName };
