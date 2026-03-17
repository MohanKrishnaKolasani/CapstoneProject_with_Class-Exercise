const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/userschema");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });

  const savedUser = await newUser.save();

  console.log("User saved successfully:", savedUser);

  res.send("Registration successful for " + name);
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;