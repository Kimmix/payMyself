const express = require("express");
const User = require("../models").User;
const router = express.Router();

router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { user_email: email } })
    .then(user => {
      if (user) {
        res.status(400).json({ errors: "Your email has already used" });
      } else {
        User.create({ user_email: email, user_password: password })
          .then(userRecord => {
            res.status(201).json({ msg: "User created." });
          })
          .catch(error => res.status(400).send(error));
      }
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
