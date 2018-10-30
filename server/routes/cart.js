const express = require('express');
const Cart = require('../models').Cart;
const Cart_Item = require('../models').Cart_Item;
const Order = require('../models').Order;
const Order_Item = require('../models').Order_Item;
const Product = require('../models').Product;
const router = express.Router();
import authenticate from '../middlewares/authenticate';
router.use(authenticate);

router.get('/', (req, res) => {
  Cart.findById(req.currentUser.user_id).then(cart => {
    if (!cart) {
      res.status(404).send({ msg: 'Cart empty' });
      return;
    }
    Cart_Item.findAll({
      where: { cart_fk: cart.cart_id },
      attributes: ['cart_item_id', 'cart_item_qty'],
      include: [
        {
          model: Product,
          attributes: ['product_name', 'product_price']
        }
      ]
    })
      .then(item => {
        let total = 0;
        for (let i = 0; i < item.length; i++) {
          total += item[i].Product.product_price * item[i].cart_item_qty;
        }
        res.status(200).json({
          item_in_cart: item,
          count: item.length,
          total: total
        });
      })
      .catch(error => res.status(400).send(error));
  });
});

router.post('/', (req, res) => {
  Product.findById(req.body.product).then(product => {
    if (!product) {
      res.status(404).send({ msg: 'Item Not Found' });
      return;
    }
    Cart.findOrCreate({
      where: { cart_id: req.currentUser.user_id }
    }).then(cart => {
      Cart_Item.findOne({
        where: {
          product_fk: req.body.product,
          cart_fk: cart[0].cart_id
        }
      }).then(item => {
        if (item) {
          item
            .increment('cart_item_qty')
            .then(() => res.status(201).json({ msg: 'Item incremented' }))
            .catch(error => res.status(400).send(error));
        } else {
          Cart_Item.create({
            product_fk: req.body.product,
            cart_fk: req.currentUser.user_id
          })
            .then(() => res.status(201).json({ msg: 'Item added' }))
            .catch(error => res.status(400).send(error));
        }
      });
    });
  });
});

router.delete('/:item', (req, res) => {
  Cart.findOne({
    where: { cart_id: req.currentUser.user_id }
  })
    .then(cart => {
      Cart_Item.findOne({
        where: { cart_item_id: req.params.item }
      }).then(item => {
        if (!item) res.status(404).send({ msg: 'Item Not Found' });
        else item.destroy().then(() => res.status(204).send());
      });
    })
    .catch(error => res.status(400).send(error));
});

router.get('/complete', (req, res) => {
  const curUser = req.currentUser.user_id;
  Cart.findById(curUser).then(cart => {
    if (!cart) res.status(200).send({ msg: 'Cart Not Found' });
    else {
      Cart_Item.findAll({
        where: { cart_fk: curUser },
        include: [Product]
      }).then(item => {
        let total = 0;
        for (let i = 0; i < item.length; i++) {
          total += item[i].Product.product_price * item[i].cart_item_qty;
        }
        Order.create({
          user_fk: curUser,
          order_total: total
        }).then(order => {
          if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
              Order_Item.create({
                order_item_id: order.order_id * 100 + (i + 1),
                order_fk: order.order_id,
                product_fk: item[i].product_fk,
                order_item_price: item[i].Product.product_price,
                order_item_qty: item[i].cart_item_qty
              });
            }
          }
        });
        // clearCart(res, curUser);
        Cart.destroy({ where: { cart_id: curUser } })
          .then(() => {
            res.status(200).send({ msg: 'Thanks for shopping with us' });
          })
          .catch(error => res.status(400).send(error));
      });
    }
  });
});

// clearCart = (res, curUser) => {
//   Cart.destroy({ where: { cart_id: curUser } })
//     .then(() => {
//       res.status(200).send({ msg: "Thanks for shopping with us" });
//     })
//     .catch(error => res.status(400).send(error));
// };

module.exports = router;
