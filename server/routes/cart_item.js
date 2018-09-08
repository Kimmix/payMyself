const express = require("express");
const Cart = require("../models").Cart;
const Cart_Item = require("../models").Cart_Item;
const Order = require("../models").Order;
const Order_Item = require("../models").Order_Item;
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
        attributes: ["cart_item_id", "cart_item_qty", "cart_item_sum"],
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
      Cart_Item.sum("cart_item_sum").then(sum => {
        res.status(200).json({
          item_in_cart: data.rows,
          count: data.count,
          total: sum
        });
      })
    )
    .catch(error => res.status(400).send(error));
});

router.post("/", (req, res) => {
  Product.findById(req.body.product)
    .then(product => {
      Cart.findOrCreate({
        where: { cart_id: req.currentUser.user_id }
      })
        .then(cart => {
          Cart_Item.findOne({
            where: {
              product_fk: req.body.product,
              cart_fk: req.currentUser.user_id
            }
          }).then(item => {
            if (item) {
              item.increment("cart_item_qty");
              Cart_Item.update(
                {
                  cart_item_sum:
                    (item.cart_item_qty + 1) * product.product_price
                },
                {
                  where: {
                    product_fk: req.body.product,
                    cart_fk: req.currentUser.user_id
                  }
                }
              )
                .then(() => res.status(201).json({ msg: "Item incremented" }))
                .catch(error => res.status(400).send(error));
            } else {
              Cart_Item.create({
                product_fk: req.body.product,
                cart_fk: req.currentUser.user_id,
                cart_item_sum: product.product_price
              })
                .then(() => res.status(201).json({ msg: "Item added" }))
                .catch(error => res.status(400).send(error));
            }
          });
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
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

router.post("/complete", (req, res) => {
  Cart.findOne({
    where: { cart_id: req.currentUser.user_id }
  })
    .then(cart => {
      Cart_Item.findAndCountAll({
        where: { cart_item_id: req.params.item }
      }).then(item => {
        Order.create({
          user_fk: req.currentUser.user_id
          // order_total: total
        }).then(order => {
          Order_Item.create({
            order_fk: order.order_id,
            product_fk: item.product_fk,
            order_item_qty: item.cart_item_qty,
            order_item_total: item.cart_item_sum
          });
        });
      });
    })
    .catch(error => res.status(400).send(error));
});

module.exports = router;
