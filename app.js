const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

dotenv.config();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Route path
app.use('/api/v1/admin', require('./server/routes/admin'));
app.use('/api/v1/auth', require('./server/routes/auth'));
app.use('/api/v1/user', require('./server/routes/user'));
app.use('/api/v1/payment', require('./server/routes/payment'));
app.use('/api/v1/product', require('./server/routes/product'));
app.use('/api/v1/cart', require('./server/routes/cart'));
app.use('/api/v1/order', require('./server/routes/order'));
app.use("/api/v1/article", require("./server/routes/article"))
app.get('/', (req, res) =>
  res.status(200).send({
    message:
      'Nobody exists on purpose. Nobody belong anywhere. We are all going to die.'
  })
);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log('\x1b[34m', `🌏 Running on http://localhost:${port}`)
);
module.exports = app;
