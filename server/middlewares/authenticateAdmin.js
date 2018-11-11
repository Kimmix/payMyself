const jwt = require('jsonwebtoken');
const User = require('../models').User;

module.exports = function authAdmin(req, res, next) {
  const header = req.headers.authorization;
  let token;

  if (header) token = header.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(501).send('Invalid token');
      } else {
        User.findOne({ where: { user_id: decoded.user_id } }).then(user => {
          if (decoded.user_isAdmin) {
            req.currentUser = user;
            next();
          } else {
            res.status(502).send('Admin is required');
          }
        });
      }
    });
  } else {
    res.status(500).send('Token is required');
  }
};
