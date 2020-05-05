const { fetchUserByUserName } = require("../models/users.models");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUserName(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};
