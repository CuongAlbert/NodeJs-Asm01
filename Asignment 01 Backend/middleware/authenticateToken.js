const UserTokens = require("../models/UserToken");

const userTokens = UserTokens.all();

function authenticateToken(req, res, next) {
  // get token param
  const token = req.get("Authorization");
  console.log(token);

  // check token existed
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // check validate token
  const user = userTokens.find((user) => user.token === token);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Call next function to do continue
  next();
}

module.exports = authenticateToken;
