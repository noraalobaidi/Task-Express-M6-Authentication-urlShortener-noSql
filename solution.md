### Signup Route

1. In `users.controllers`, create a method called `signup`.
2. Install `bcrypt` and require it in `users.controllers`.

```shell
npm install bcrypt
```

3. Hash the password with `10` salt rounds and overwrite `req.body.password` with the new, hashed password.

```js
const { password } = req.body;
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
req.body.password = hashedPassword;
```

4. Pass the body of the request to `User.create`.

```js
const newUser = await User.create(req.body);
```

5. Change the response status to `201` and end it with a message.

### Passport Setup

1. Install `passport` and `passport-local`.

```shell
npm install passport passport-local
```

2. Require `passport` in `app.js`.

```js
const passport = require('passport');
```

3. Call the `app.use` method and pass it `passport.initialize()`.

```js
// Passport Setup
app.use(passport.initialize());
```

### Local Strategy

1. In `middleware`, create a file called `passport.js`.
2. Require `LocalStrategy` from `passport-local`.

```js
const LocalStrategy = require('passport-local').Strategy;
```

3. Create a variable called `localStrategy` that's equal to a `LocalStrategy` instance.

```js
exports.localStrategy = new LocalStrategy();
```

4. Pass `LocalStrategy` an asynchronous function as an argument. This function receives three parameters: `username`, `password` and `done`.

```js
exports.localStrategy = new LocalStrategy(
  async (username, password, done) => {}
);
```

5. Add a `try catch` statement in the function. In the `catch` block, call `done` and pass it `error`.

```js
try {
} catch (error) {
  done(error);
}
```

6. Look for a `user` in the `User` model that has the `username` that's passed to the local strategy. Save it in a variable called `user`.

```js
try {
  const user = await User.findOne({
    username,
  });
} catch (error) {
  done(error);
}
```

7. Don't forget to import `User`.
8. Import `bcrypt`.

```js
const bcrypt = require('bcrypt');
```

9. If `user` exists, call `bcrypt.compare()` and pass it `password` and `user.password` for comparison.

```js
if (user) {
  await bcrypt.compare(password, user.password);
}
```

10. Save the returned value in a variable called `passwordsMatch`.

```js
if (user) {
  passwordsMatch = await bcrypt.compare(password, user.password);
}
```

11. If `user` doesn't exist, set `passwordsMatch` to `false`.

```js
if (user) {
  passwordsMatch = await bcrypt.compare(password, user.password);
} else {
  passwordsMatch = false;
}
```

12. If `passwordsMatch` is `true`, return `done()` and pass it two arguments, `null` and `user`.

```js
if (passwordsMatch) {
  return done(null, student);
}
```

13. Else, return `done()` and pass it two arguments, `null` and `false`.

```js
if (passwordsMatch) {
  return done(null, student);
}
return done(null, false);
```

14. In `app.js`, require the `localStrategy` instance that we just created.

```js
const { localStrategy } = require('./middleware/passport');
```

15. Under the passport initialization, call `passport.use()` and pass it `localStrategy`.

```js
app.use(passport.initialize());
passport.use(localStrategy);
```

16. In the `/signin` route, call `passport.authenticate()` and pass it "`local`" and `{ session: false }` as arguments.

```js
const passport = require('passport');

router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  signin
);
```

17. Test your route in Postman.

### Config Folder

1. Create a new folder called `config`.
2. In this folder create a file called `keys.js`.
3. Create an object that has two properties:
   `JWT_SECRET`: give it a secret key.
   `JWT_EXPIRATION_MS`: give it the time for your token expiration in milliseconds.

```js
const keys = {
  JWT_SECRET: 'secretKey',
  JWT_EXPIRATION_MS: 9000000,
};
```

4. Export this object

```js
const keys = {
  JWT_SECRET: 'secretKey',
  JWT_EXPIRATION_MS: 9000000,
};

module.exports = keys;
```

### Generating a Token

Generate a token in `user` controller's `signin` function.

1. Require `JWT_EXPIRATION_MS` and `JWT_SECRET` from `config/keys.js`.
2. Install `jsonwebtoken`.
3. Require `jwt` from `jsonwebtoken`.
4. In the `signin` function, create an object called `payload` and pass it the `user`'s information that's coming from `req.user`.

```js
const { user } = req;
const payload = {
  id: user.id,
  username: user.username,
};
```

5. Keep in mind that the `token` must have the `user`'s ID and the expiration date of the token.
6. Add an `expires` property to `payload` and its value is the date right now plus `JWT_EXPIRATION_MS`.

```js
const payload = {
  id: user.id,
  username: user.username,
  exp: Date.now() + JWT_EXPIRATION_MS,
};
```

7. After creating your payload object, call `jwt.sign()` and pass it two arguments:
   `payload`, make sure to stringify it.
   `JWT_SECRET`

```js
jwt.sign(JSON.stringify(payload), JWT_SECRET);
```

8. Save the returned value in a variable called `token`.

```js
const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
```

9. Send `token` as a json response.

```js
res.json({ token });
```

### Signin After Signup

1. In the user controller's signup function, create a payload object that takes its details from newUser and encrypt it.

```js
const payload = {
  id: newUser.id,
  username: newUser.username,
  exp: Date.now() + JWT_EXPIRATION_MS,
};
const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
```

2. Pass the token as a reponse.

```js
res.status(201).json({ token });
```

### JWT Strategy

1. Start with installing the `JWT strategy`.

```shell
$ npm install passport-jwt
```

2. In `middleware/passport.js` require `JWTStrategy`.

```js
const JWTStrategy = require('passport-jwt').Strategy;
```

3. We will create a JWT strategy instance, which takes two arguments, an `options` object and a callback function.

```js
exports.jwtStrategy = new JWTStrategy({}, () => {});
```

4. Tokens can be extracted from the request in many ways. We will pass our token in the request's authorization header with the scheme bearer. We need to require `fromAuthHeaderAsBearerToken`.

```js
const { fromAuthHeaderAsBearerToken } = require('passport-jwt').ExtractJwt;
```

5. Now we will pass this method to our `options` object. Also, we will pass our `secret key` we defined in `config/keys.js`.

```js
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  () => {}
);
```

6. Now the second argument, an asynchronous callback function, takes two arguments, the token's payload and done method. So the JWT strategy decodes the token and passes the payload as an argument.

```js
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {}
);
```

7. Check if the token is expired or not by comparing the expiration date to the date right now. If the token is expired, call `done` and pass it `null` and `false` as arguments, which will throw a `401` error.

```js
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (jwtPayload, done) => {
    if (Date.now() > jwtPayload.exp) {
      return done(null, false); // this will throw a 401
    }
  }
);
```

8. If the token is not expired, we will find the `user` with the ID saved in the token. You can use `findOne` and pass it the `username`. Then we will pass the found `user` to `done`. If no `user` is found, it will throw a `401` error.

```js
async (jwtPayload, done) => {
  if (Date.now() > jwtPayload.exp) {
    return done(null, false); // this will throw a 401
  }
  try {
    const user = await User.findByPk(jwtPayload.id);
    done(null, user); // if there is no user, this will throw a 401
  } catch (error) {
    done(error);
  }
};
```

9. Let's initialize our strategy in `app.js`. Require `jwtStrategy` and pass it to `passport.use()`.

```js
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
```

### 🍋 :userId

In the `shorten`, use `req.user` instead of the route param.

1. First, add authentication to the shorten route:

```js
router.post(
  '/shorten',
  passport.authenticate('jwt', { session: false }),
  shorten
);
```

2. Then replace each `req.params.userId` with `req.user.id`:

```js
exports.shorten = async (req, res) => {
  // create url code
  const urlCode = shortid.generate();
  try {
    req.body.shortUrl = baseUrl + '/' + urlCode;
    req.body.urlCode = urlCode;
    req.body.userId = req.user._id;
    const newUrl = await Url.create(req.body);
    await User.findByIdAndUpdate(req.user._id, {
      $push: { urls: newUrl._id },
    });
    res.json(newUrl);
  } catch (err) {
    res.status(500).json('Server Error');
  }
};
```

### 🌶️ Permissions!

If the user is not the one who created the url, don't allow him to delete it!

1. First, add authentication to the delete route:

```js
router.delete(
  '/:code',
  passport.authenticate('jwt', { session: false }),
  deleteUrl
);
```

2. Use `req.user` to make the check:

```js
if (url.userId != req.user.id.toString()) {
  return res.status(401).json('Unauthorized');
}
```
