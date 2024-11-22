const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (payload) => {
  try {
    return (
      JWT.sign(payload, String(process.env.JWT_SECRET)),
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
  } catch (e) {
    throw new Error("Invalid signature");
  }
};

// token verify

const verifyToken = (token) => {
  try {
    return JWT.verify(token, String(process.env.JWT_SECRET));
  } catch (e) {
    throw new Error("Invalid token");
  }
};

// hash
const hash = async (data) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
};

const compare = async (data, hash) => {
  return bcrypt.compare(data, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  hash,
  compare,
};
