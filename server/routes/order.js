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

router.get('/show', (req, res) => {
  Order.findAll({
    where: { user_fk: req.currentUser.user_id },
    attributes: ['order_id', 'order_total', 'order_id', 'createdAt']
  })
    .then(order => {
      res.status(200).json(order);
    })
    .catch(error => res.status(500).send(error));
});

router.get('/:order', (req, res) => {
  const { order } = req.params;
  Order.findOne({
    where: { user_fk: req.currentUser.user_id, order_id: order }
  })
    .then(orders => {
      if (!orders) res.status(404).send('not found');
      Order_Item.findAll({
        where: { order_fk: order },
        attributes: ['order_item_id', 'order_item_qty', 'order_item_price'],
        include: [
          {
            model: Product,
            attributes: [
              'product_name',
              'product_price',
              'product_picture_url',
              'product_description'
            ]
          }
        ]
      }).then(items => {
        res.status(200).json({ data: items });
      });
    })
    .catch(error => res.status(500).send(error));
});

router.get('/checkout', (req, res) => {
  try {
    User.findById(req.currentUser.user_id).then(user => {
      Cart.findById(user.user_id).then(cart => {
        if (!cart) res.status(501).send('Cart Not Found');
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
              res.status(502).send('Please refill money');
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
                          res.status(200).send('Thanks for shopping with us');
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
    res.status(500).send(err);
  }
});

module.exports = router;
