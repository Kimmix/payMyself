const express = require('express');
const Product = require('../models').Product;
const router = express.Router();
import authenticate from '../middlewares/authenticateAdmin';
router.use(authenticate);

//Product management
router.post('/product', (req, res) => {
  Product.create({
    product_id: req.body.id,
    product_name: req.body.name,
    product_description: req.body.description,
    product_picture_url: req.body.url,
    product_price: req.body.price
  })
    .then(product => res.status(201).json({ msg: 'Product created' }))
    .catch(error => res.status(400).send(error));
});

router.delete('/product/:id', (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if (!product) return res.status(400).send({ msg: 'Product Not Found' });
      return product
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
