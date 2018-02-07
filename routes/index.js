var express = require('express');
var router = express.Router();

const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// login
router.post('/login',
  passport.authenticate('local'),
  function (req, res) {
    console.log('authed user: ');
    console.log(req.user);
    res.send(JSON.stringify(req.user));
  }
);

module.exports = router;
