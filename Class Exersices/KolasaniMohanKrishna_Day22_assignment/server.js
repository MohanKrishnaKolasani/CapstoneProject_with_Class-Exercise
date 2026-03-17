const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();

require("./connection");

const User = require("./models/userschema");

const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});