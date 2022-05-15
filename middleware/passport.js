const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/keys');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;
const { fromAuthHeaderAsBearerToken } = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({
      username,
    });
    if (user) {
      passwordsMatch = await bcrypt.compare(password, user.password);
    } else {
      passwordsMatch = false;
    }
    if (passwordsMatch) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    done(error);
  }
});

exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false); // this will throw a 401
    }
    try {
      const user = await User.findOne({ _id: jwtPayload.id });
      done(null, user); // if there is no user, this will throw a 401
    } catch (error) {
      done(error);
    }
  }
);
