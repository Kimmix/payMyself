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
    product_price: req.body.price
  })
    .then(product => res.status(201).json('Product created'))
    .catch(error => res.status(500).send(error));
});

router.delete('/product/:product_id', (req, res) => {
  const { product_id } = req.params;
  Product.findById(product_id)
    .then(product => {
      if (!product) return res.status(502).send('Product Not Found');
      else
        return product
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(501).send(error));
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
