const express = require('express');
const Payment = require('../models').Payment;
const router = express.Router();
const auth = require('../middlewares/authenticate');

router.use(auth);
router.get('/', (req, res) => {
  Payment.findAll({
    where: { user_fk: req.currentUser.user_id },
    order: [['createdAt', 'DESC']],
    limit: 10
  })
    .then(payment => res.status(200).json(payment))
    .catch(error => res.status(500).send(error));
});

module.exports = router;
