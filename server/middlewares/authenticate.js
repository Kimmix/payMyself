const jwt = require('jsonwebtoken');
const User = require('../models').User;

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(500).send({ error: { global: 'Invalid token' } });
      } else {
        User.findOne({ where: { user_id: decoded.user_id } }).then(user => {
          if (!user) {
            res.status(500).send({ error: { global: 'Invalid user' } });
          } else {
            req.currentUser = user;
            next();
          }
        });
      }
    });
  } else {
    res.status(500).send({ error: { global: 'Token is required' } });
  }
};
