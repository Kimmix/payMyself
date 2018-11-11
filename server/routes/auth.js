const express = require("express");
const User = require("../models").User;
const router = express.Router();
const bcrypt = require("bcrypt");

//Login
router.post("/", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { user_email: email } }).then(user => {
    if (user) {
      bcrypt.compare(password, user.user_password, (err, result) => {
        if (result) res.json({ user: user.toAuthJSON() });
        else res.status(500).sent({ error: "Invalid password" });
      });
    } else res.status(500).sent({ error: "User not found" });
  });
});

module.exports = router;
