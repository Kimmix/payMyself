const express = require('express');
const Article = require('../models').Article;
const auth = require('../middlewares/authenticate');
const router = express.Router();

router.get('/', (req, res) => {
  Article.findAll()
    .then(article => res.status(200).send(article))
    .catch(error => res.status(500).send(error));
});

router.post('/product', auth, (req, res) => {
  const { title, excerpt, content } = req.body;
  Article.create({
    user_fk: req.currentUser.user_id,
    title, excerpt, content
  })
    .then(article => res.status(201).json(article.title + ' created'))
    .catch(error => res.status(500).send(error));
});

module.exports = router;
