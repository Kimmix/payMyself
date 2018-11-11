const express = require('express');
const User = require('../models').User;
const Cart = require('../models').Cart;
const Cart_Item = require('../models').Cart_Item;
const Product = require('../models').Product;
const Order = require('../models').Order;
const Order_Item = require('../models').Order_Item;
const router = express.Router();
const auth = require('../middlewares/authenticate');
router.use(auth);

router.get('/checkout', (req, res) => {
  try {
    User.findById(req.currentUser.user_id).then(user => {
      Cart.findById(user.user_id).then(cart => {
        if (!cart) res.status(501).send({ error: 'Cart Not Found' });
        else {
          Cart_Item.findAll({
            where: { cart_fk: user.user_id },
            include: [Product]
          }).then(item => {
            //Find Total
            let total = 0;
            for (let i = 0; i < item.length; i++) {
              total += item[i].Product.product_price * item[i].cart_item_qty;
            }
            //Payment
            if (total > user.user_money)
              res.status(502).send({ error: 'Please refill money' });
            else {
              Order.create({
                user_fk: user.user_id,
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
                    }).then(() => {
                      Cart.destroy({ where: { cart_id: user.user_id } }).then(
                        () => {
                          res
                            .status(200)
                            .send({ msg: 'Thanks for shopping with us' });
                        }
                      );
                    });
                  }
                }
                User.decrement('user_money', {
                  by: total,
                  where: { user_id: user.user_id }
                });
              });
            }
          });
        }
      });
    });
  } catch (err) {
    res.status(500).send({ errors: err });
  }
});

module.exports = router;
