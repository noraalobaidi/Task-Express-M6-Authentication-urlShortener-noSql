const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// exports.generateToken = (user) => {
//   const payload = {
//     _id: user._id,
//     username: user.username,
//     exp: Date.now() + 36000000,
//   };
//   const token = jwt.sign(payload, "bnotno7s");
//   return token;
// };

exports.signin = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    // const token = generateToken(newUser);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json("Server Error");
  }
};
