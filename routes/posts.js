var express = require('express');
var router = express.Router();

const db = require('../db');

/* GET posts listing. */
router.get('/', function (req, res, next) {

  db.any('SELECT * FROM posts')
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.warn(error);
    });
});

/* POST create new post */
router.post('/', function (req, res, next) {

  db.one('INSERT INTO posts(title, link, content, num_points) VALUES ($1, $2, $3, 0) RETURNING *', [
    req.body.title,
    req.body.link,
    req.body.content,
  ])
    .then(data => {
      res.send(JSON.stringify(data));
    })
    .catch(error => { console.log(error) })
});

module.exports = router;
