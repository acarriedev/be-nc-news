const ENV = process.env.NODE_ENV || "development";

const data = {
  development: require("./development-data/index"),
  test: require("./test-data"),
  production: require("./development-data/index"),
};

module.exports = data[ENV];
