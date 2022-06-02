const User = require("../models/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    const passwordsMatch = user
      ? bcrypt.compareSync(password, user.password)
      : false;
    if (passwordsMatch) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    done(error);
  }
});
