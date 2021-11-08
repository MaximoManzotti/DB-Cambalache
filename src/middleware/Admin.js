const JWT = require("jsonwebtoken");
const User = require("../models/Users");
const client = require("./Redis");

module.exports = async (req, res, next) => {
  try {
    client.get("token", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        token(data);
      }
    });
    let token = async (data) => {
      if (data != null) {
        const decoded = JWT.verify(data, process.env.SECRET);
        let isAdmin = await User.findOne({
          where: { id: decoded.id, isAdmin: true },
        });
        if (isAdmin) {
          next();
        } else {
          res.status(403).json({ message: "Forbidden Access" });
        }
      }
    };
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      error: error,
    });
  }
};
