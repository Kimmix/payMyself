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
      Cart_Item.sum("cart_item_sum").then(sum => {
        res.status(200).json({
          item_in_cart: data.rows,
          count: data.count,
          sum: sum
        });
      })
    )
    .catch(error => res.status(400).send(error));
});

// router.post("/", (req, res) => {
//   Product.findById(req.body.product).then(product => {
//     Cart.findOrCreate({
//       where: { cart_id: req.currentUser.user_id }
//     })
//       .then(cart => {
//         Cart_Item.findOrCreate({
//           where: {
//             product_fk: req.body.product,
//             cart_fk: req.currentUser.user_id
//           }
//         })
//           .spread((cartResult, created) => {
//             let sum = cartResult.cart_item_qty * product.product_price;
//             console.log("Hellooooooooooooooo");
//             console.log(sum);
//             if (created) {
//               Cart_Item.update({
//                 cart_item_sum: sum
//               })
//                 .then(() => res.status(201).json({ msg: "Item added" }))
//                 .catch(error => res.status(400).send(error));
//             } else {
//               cartResult.increment("cart_item_qty");
//               Cart_Item.update(
//                 {
//                   cart_item_sum: sum
//                 },
//                 { where: { cartResult } }
//               )
//                 .then(() => res.status(201).json({ msg: "Item incremented" }))
//                 .catch(error => res.status(400).send(error));
//             }
//           })
//           .catch(error => res.status(400).send(error));
//       })
//       .catch(error => res.status(400).send(error));
//   });
// });

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
                cart_item_sum: 1 * product.product_price
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

module.exports = router;
