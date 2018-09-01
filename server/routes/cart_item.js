const express = require("express");
const Cart = require("../models").Cart;
const Cart_Item = require("../models").Cart_Item;
const Product = require("../models").Product;
const router = express.Router();
import authenticate from "../middlewares/authenticate";
router.use(authenticate);

router.get("/", (req, res) => {
  Cart.findAndCountAll({
    where: { cart_id: req.currentUser.user_id },
    attributes: ["cart_id"],
    include: [
      {
        model: Cart_Item,
        attributes: ["cart_item_id", "cart_item_qty"],
        include: [
          {
            model: Product,
            attributes: ["product_name", "product_price"]
          }
        ]
      }
    ],
    order: [[{ model: Cart_Item }, "createdAt", "ASC"]]
  })
    .then(data =>
      res.status(200).json({
        item_in_cart: data.rows,
        count: data.count
      })
    )
    .catch(error => res.status(400).send(error));
});

router.post("/", (req, res) => {
  Cart.findOrCreate({
    where: { cart_id: req.currentUser.user_id }
  }).then(cart => {
    Cart_Item.findOrCreate({
      where: {
        product_fk: req.body.product,
        cart_fk: req.currentUser.user_id
      }
    })
      .spread((cartResult, created) => {
        if (created) {
          res.status(201).json({ msg: "Item added to cart" });
        } else {
          cartResult
            .increment("cart_item_qty")
            .then(() => res.status(201).json({ msg: "Item incremented" }));
        }
      })
      .catch(error => res.status(400).send(error));
  });
});

router.delete("/:item", (req, res) => {
  Cart.findOne({
    where: { cart_id: req.currentUser.user_id }
  })
    .then(cart => {
      Cart_Item.findOne({
        where: { cart_item_id: req.params.item }
      }).then(item => {
        if (!item) {
          res.status(404).send({ msg: "Item Not Found" });
        } else {
          item.destroy().then(() => res.status(204).send());
        }
      });
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
