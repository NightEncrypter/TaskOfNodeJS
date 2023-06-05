const jwt = require("jsonwebtoken");

const config = require("config");

module.exports = (req, res, next) => {
  const token = req.header("Aspire123");

  if (!token) {
    return res.status(401).json({ msg: "NO TOKEN, Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, config.get("secret"));

    req.user = decoded.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
