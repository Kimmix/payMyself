const express = require('express');
const Product = require('../models').Product;
const router = express.Router();

router.get('/', (req, res) => {
  Product.findAll()
    .then(product => res.status(200).send(product))
    .catch(error => res.status(500).send(error));
});

router.get('/:product_id', (req, res) => {
  console.log('Server quest id =' + req.query.product_id);
  Product.findById(req.query.product_id)
    .then(product => {
      if (!product) return res.status(500).send('Product Not Found');
      else res.status(200).send(product);
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
