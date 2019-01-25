const express = require('express');
const Article = require('../models').Article;
const auth = require('../middlewares/authenticate');
const router = express.Router();

router.get('/', (req, res) => {
  Article.findAll()
    .then(article => res.status(200).send(article))
    .catch(error => res.status(500).send(error));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  Article.findById(id)
    .then(article => {
      if (!article) return res.status(500).send('Article Not Found');
      else res.status(200).send(article);
    })
    .catch(error => res.status(500).send(error));
});

router.post('/', auth, (req, res) => {
  const { title, excerpt, content } = req.body;
  Article.create({
    user_fk: req.currentUser.user_id,
    title: title,
    excerpt: excerpt,
    content: content
  })
    .then(article => res.status(201).json(article.title + ' created'))
    .catch(error => res.status(500).send(error));
});

router.put('/:id', auth, (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content } = req.body;
  Article.findById(id)
    .then(article => {
      if (article.user_fk === req.currentUser.user_id) {
        article
          .update({
            title: title,
            excerpt: excerpt,
            content: content
          })
          .then(article =>
            res.status(203).json(article.title + ' updated')
          );
      }
      else res.status(500).send('Article Not Found');
    })
    .catch(error => res.status(500).send(error));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Article.findById(id)
    .then(article => {
      if (!article) return res.status(502).send('Article Not Found');
      else return article.destroy().then(() => res.status(204).send(article.title + 'deleted'));
    })
    .catch(error => res.status(500).send(error));
});

module.exports = router;
