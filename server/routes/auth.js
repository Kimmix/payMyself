const express = require('express');
const User = require('../models').User;
const router = express.Router();
const bcrypt = require('bcrypt');

//Login
router.post('/', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ where: { user_email: email } }).then(user => {
    if (user) {
      bcrypt.compare(password, user.user_password, (err, result) => {
        const token = user.toAuthJSON();
        if (result)
          res
            .header('Authorization', 'Bearer ${token}')
            .json({
              user: {
                user_email: this.email,
                user_isAdmin: this.user_isAdmin,
                token: token
              }
            });
        else res.status(501).send('Invalid password');
      });
    } else res.status(500).send('User not found');
  });
});

module.exports = router;
