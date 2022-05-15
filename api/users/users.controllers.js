const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_EXPIRATION_MS, JWT_SECRET } = require('../../config/keys');

exports.signin = async (req, res) => {
  try {
    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json('Server Error');
  }
};

exports.signup = async (req, res) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json('Server Error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('urls');
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json('Server Error');
  }
};
