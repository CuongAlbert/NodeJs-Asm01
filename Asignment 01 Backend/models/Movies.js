const fs = require("fs");

const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "movieList.json"
);
const Movies = {
  all: function () {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  },
};

module.exports = Movies;
