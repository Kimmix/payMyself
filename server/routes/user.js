const express = require('express');
const User = require('../models').User;
const auth = require('../middlewares/authenticate');
const router = express.Router();

router.post('/signup', (req, res) => {
  const { email, password, name, sex, tel } = req.body;
  try {
    User.findOne({ where: { user_email: email } }).then(user => {
      if (user) res.status(500).sent({ error: 'Your email has already used' });
      else {
        User.create({
          user_email: email,
          user_password: password,
          user_name: name,
          user_sex: sex,
          user_tel: tel
        }).then(() => {
          res.status(201).json({ msg: 'User created.' });
        });
      }
    });
  } catch (err) {
    res.status(500).sent({ error: err });
  }
});

router.get('/', auth, (req, res) => {
  User.findOne({
    where: { user_id: req.currentUser.user_id },
    attributes: [
      'user_email',
      'user_name',
      'user_name',
      'user_sex',
      'user_tel',
      'user_money'
    ]
  })
    .then(user => {
      res.status(200).json({ data: user });
    })
    .catch(error => res.status(500).send(error));
});

router.post('/money', auth, (req, res) => {
  const { money } = req.body;
  User.increment('user_money', {
    by: money,
    where: { user_id: req.currentUser.user_id }
  })
    .then(() => {
      res.status(200).json({ msg: 'Money refilled' });
    })
    .catch(error => res.status(500).send(error));
});

router.post('pin', auth, (req, res) => {
  const { pin } = req.body;
  User.update(
    {
      user_pin: pin
    },
    {
      where: { user_id: req.currentUser.user_id }
    }
  )
    .then(() => {
      res.status(200).json({ msg: 'Pin seted' });
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
