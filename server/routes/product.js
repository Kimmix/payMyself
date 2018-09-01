const express = require("express");
const Product = require("../models").Product;
const router = express.Router();

router.get("/", (req, res) => {
  Product.findAll()
    .then(product => res.status(200).send(product))
    .catch(error => res.status(400).send(error));
});

router.get("/:product_id", (req, res) => {
  Product.find({
    where: {
      product_id: req.params.product_id
    }
  })
    .then(product => {
      if (!product) {
        return res.status(400).send({ msg: "Product Not Found" });
      }
      res.status(200).send(product);
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
