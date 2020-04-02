//Router
var express = require('express');
var router = express.Router();
var User=require('../model/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const{
  check,
  validationResult
}=require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register',[
  check('email','Please fill your email.').isEmail(),
  check('name','Please fill your name.').not().isEmpty(),
  check('password','Please fill your password.').not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  //Validation Data
  if (!result.isEmpty()) {
    //Return error to views
    res.render('register', {
      errors: errors
    })
  } else {
    //Insert  Data
    var name = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var newUser = new User({
      name: name,
      password: password,
      email: email
    });
    User.createUser(newUser, function(err, user) {
      if (err) throw err
    });
    res.location('/');
    res.redirect('/');
  }

});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/users/login');
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: false
  }),
  function(req, res) {
        req.flash("success", "ลงชื่อเข้าใช้เรียบร้อยแล้ว");
        res.redirect('/');
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByName(username, function(err, user) {
    if (err) throw error;
    //console.log(user);
    if (!user) {
        return done(null, false);
    }else{
        return done(null, user);
    }

    User.comparePassword(password, user.password, function(err, isMatch) {
      if (err) return err;
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  });
}));

module.exports = router;
