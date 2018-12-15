const express = require('express');
const Product = require('../models').Product;
const router = express.Router();
const authAdmin = require('../middlewares/authenticateAdmin');

router.use(authAdmin);
//Product management
router.post('/product', (req, res) => {
  Product.create({
    product_id: req.body.id,
    product_name: req.body.name,
    product_description: req.body.description,
    product_picture_url: req.body.url,
    product_price: req.body.price,
    product_stock: req.body.stock
  })
    .then(product => res.status(201).json(product.product_name + ' created'))
    .catch(error => res.status(500).send(error));
});

router.put('/product', (req, res) => {
  const { id, name, description, url, price, stock } = req.body;
  Product.findById(id)
    .then(product => {
      product
        .update({
          product_name: name,
          product_description: description,
          product_picture_url: url,
          product_price: price,
          product_stock: stock
        })
        .then(product => res.status(203).json(product.product_name));
    })
    .catch(error => res.status(500).send(error));
});

router.delete('/product/', (req, res) => {
  const { item } = req.body;
  Product.findById(item)
    .then(product => {
      if (!product) return res.status(502).send('Product Not Found');
      else return product.destroy().then(() => res.status(204).send());
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
