var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  console.log(req.body.username);
  console.log(req.body.password);
});

module.exports = router;
