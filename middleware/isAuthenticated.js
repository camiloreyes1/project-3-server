const jwt = require("jsonwebtoken");
const User = require("../models/User.js")
const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }
 
  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    req.user = tokenInfo;
    console.log("USER======>", req.user)
    next();
  } catch (error) {
    console.log(error.message, "Error.message")
    return res.status(401).json(error);
  }
  
};

module.exports = isAuthenticated;