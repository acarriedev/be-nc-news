const { fetchUserByUserName } = require("../models/users.models");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUserName(username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found." });
      } else res.send({ user: user[0] });
    })
    .catch(next);
};
