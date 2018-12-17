const express = require('express');
const User = require('../models').User;
const Cart = require('../models').Cart;
const Cart_Item = require('../models').Cart_Item;
const Product = require('../models').Product;
const Order = require('../models').Order;
const Order_Item = require('../models').Order_Item;
const Payment = require('../models').Payment;
const router = express.Router();
const auth = require('../middlewares/authenticate');
router.use(auth);

router.get('/', (req, res) => {
  Order.findAll({
    where: { user_fk: req.currentUser.user_id },
    order: [['createdAt', 'DESC']],
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
      if (!orders) res.status(404).send('Order not exist');
      else {
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
          res.status(200).json(items);
        });
      }
    })
    .catch(error => res.status(500).send(error));
});

router.post('/checkout', (req, res) => {
  try {
    User.findById(req.currentUser.user_id).then(user => {
      Cart.findById(user.user_id).then(cart => {
        if (!cart) res.status(501).send('Cart Not Found');
        else {
          Cart_Item.findAll({
            where: { cart_fk: user.user_id },
            include: [Product]
          }).then(item => {
            //Find Pre-total
            let pre_total = 0;
            for (let i = 0; i < item.length; i++) {
              pre_total +=
                item[i].Product.product_price * item[i].cart_item_qty;
            }
            //Check money
            if (pre_total > user.user_money)
              res.status(502).send('Please refill money');
            else {
              var payment = 0;
              //Make new order
              Order.create({ user_fk: user.user_id })
                .then(order => {
                  if (item.length > 0) {
                    let item_qty = 0;
                    for (var i = 0; i < item.length; i++) {
                      //Check stock
                      if (item[i].cart_item_qty > item[i].Product.product_stock)
                        item_qty = item[i].Product.product_stock;
                      else item_qty = item[i].cart_item_qty;
                      Product.decrement('product_stock', {
                        by: item_qty,
                        where: { product_id: item[i].product_fk }
                      });
                      //Create order list
                      Order_Item.create({
                        order_item_id: order.order_id * 100 + (i + 1),
                        order_fk: order.order_id,
                        product_fk: item[i].product_fk,
                        order_item_price: item[i].Product.product_price,
                        order_item_qty: item_qty
                      });
                      //Find true total sum
                      payment += item[i].Product.product_price * item_qty;
                    }
                  }
                  order.update({
                    order_total: payment
                  });
                })
                .then(() => {
                  //Cleanup
                  Cart.destroy({ where: { cart_id: user.user_id } }).then(
                    () => {
                      User.decrement('user_money', {
                        by: payment,
                        where: { user_id: user.user_id }
                      }).then(() =>
                        Payment.create({
                          payment_amount: payment,
                          payment_type: 'pay',
                          user_fk: user.user_id
                        }).then(() =>
                          res.status(200).send({
                            msg: 'Thanks for shopping with us',
                            total: payment
                          })
                        )
                      );
                    }
                  );
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
