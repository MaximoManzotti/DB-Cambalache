const JWT = require("jsonwebtoken");
const client = require("./Redis");

module.exports = async (req, res, next) => {
  try {
    let token = client.get("token", async (err, data) => {
      if (!token) {
        return res.status(401).send("Please login");
      }
      if (err) {
        console.log(err);
      } else {
        let verifyToken = JWT.verify(data, process.env.SECRET);
        if (verifyToken) {
          req.user = verifyToken;
          next();
        }
      }
    });
  } catch (error) {
    res.status(400).send("Error validating the user" + error);
  }
};
