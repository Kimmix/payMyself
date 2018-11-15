const express = require('express');
const Cart = require('../models').Cart;
const Cart_Item = require('../models').Cart_Item;
const Product = require('../models').Product;
const router = express.Router();
const auth = require('../middlewares/authenticate');
router.use(auth);

router.get('/', (req, res) => {
  Cart.findById(req.currentUser.user_id).then(cart => {
    if (!cart) {
      res.status(501).send('Cart empty');
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
      .catch(error => res.status(500).send(error));
  });
});

router.post('/', (req, res) => {
  const { item } = req.body;
  try {
    Product.findById(item).then(product => {
      if (!product) {
        res.status(501).send('Item Not Found');
      } else {
        Cart.findOrCreate({
          where: { cart_id: req.currentUser.user_id }
        }).then(cart => {
          Cart_Item.findOne({
            where: {
              product_fk: item,
              cart_fk: cart[0].cart_id
            }
          }).then(item => {
            if (item) {
              item
                .increment('cart_item_qty')
                .then(() =>
                  res.status(201).json(product.product_name + ' incremented')
                );
            } else {
              Cart_Item.create({
                product_fk: item,
                cart_fk: req.currentUser.user_id
              }).then(() =>
                res.status(201).json(product.product_name + ' added')
              );
            }
          });
        });
      }
    });
  } catch (err) {
    res.status(500).json({ errors: err });
  }
});

router.delete('/', (req, res) => {
  const { item } = req.body;
  Cart.findOne({
    where: { cart_id: req.currentUser.user_id }
  })
    .then(cart => {
      Cart_Item.findOne({
        where: { cart_item_id: item }
      }).then(item => {
        item.destroy().then(() => res.status(204).send('Item deleted'));
      });
    })
    .catch(error => res.status(500).send(error));
});

router.post('/increment', (req, res) => {
  const { item } = req.body;
  try {
    Cart.findOne({
      where: { cart_id: req.currentUser.user_id }
    }).then(cart => {
      Cart_Item.findOne({
        where: { cart_item_id: item }
      }).then(item => {
        item
          .increment('cart_item_qty')
          .then(() => res.status(201).json('Item incremented'));
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/decrement', (req, res) => {
  const { item } = req.body;
  try {
    Cart.findOne({
      where: { cart_id: req.currentUser.user_id }
    }).then(cart => {
      Cart_Item.findOne({
        where: { cart_item_id: item }
      }).then(item => {
        if (item.cart_item_qty == 1) {
          item.destroy().then(() => res.status(204).send('Item deleted'));
        } else {
          item
            .decrement('cart_item_qty')
            .then(() => res.status(201).json('Item decremented'));
        }
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
