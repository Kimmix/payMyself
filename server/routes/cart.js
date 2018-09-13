const express = require("express");
const Cart = require("../models").Cart;
const Cart_Item = require("../models").Cart_Item;
const Order = require("../models").Order;
const Order_Item = require("../models").Order_Item;
const Product = require("../models").Product;
const router = express.Router();
import authenticate from "../middlewares/authenticate";
router.use(authenticate);

// totalAmount (cartProducts => {
//   var total = 0;
//   cartProducts.forEach(product => {
//     total += product.price * product.quantity;
//   });
//   return total;
// });

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

router.get("/complete", (req, res) => {
  const curUser = req.currentUser.user_id;
  getNewOrderId(id => {
    let orderID = id + 1;
    getCartContents(res, curUser, orderID);
  });
});

function getNewOrderId(cb) {
  Order.findAll({
    order: [["order_id", "DESC"]],
    limit: 1
  }).then(orderNumber => {
    cb(orderNumber[0].dataValues.order_id);
  });
}

function getCartContents(res, curUser, orderID) {
  console.log(orderID);
  Cart.findById(curUser).then(cart => {
    if (!cart) {
      res.status(200).send({ msg: "Cart Not Found" });
    } else {
      Cart_Item.findAll({
        where: {
          cart_fk: curUser
        },
        include: [Product]
      })
        .then(item => {
          Order.create({
            order_id: orderID,
            user_fk: curUser
          });
          if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
              Order_Item.create({
                order_item_id: orderID * 100 + (i + 1),
                order_fk: orderID,
                product_fk: item[i].product_fk,
                order_item_qty: item[i].cart_item_qty,
                order_item_total: item[i].cart_item_sum
              });
            }
          }
          clearCart(res, curUser);
        })
        .catch(error => res.status(400).send(error));
    }
  });
}

function clearCart(res, curUser) {
  Cart.destroy({
    where: {
      cart_id: curUser
    }
  }).then(() => {
    res.status(200).send({ msg: "Thanks for shopping with us" });
  });
}

module.exports = router;
