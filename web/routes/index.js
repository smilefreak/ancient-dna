var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var Model = require('../models/models.js')

//Hardcoded secret should be moved to a seperate file
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
    if(!req.body.user || !req.body.pass){
        console.log("error:" + req.body.user + "  " + req.body.pass);
        return res.status(400).json({message: 'Please fill out all fields.'});
    }
  console.log(req.body.name);
    Model.User.create({
      name: req.body.name,
      email: req.body.user,
      password: req.body.pass
    }).then(function(user) {
        return res.json({token: user.jwt })
    }).catch(function(error) {
        //req.flash('error', "Please, choose a different username.")
        res.redirect('/register')
    });
    
});

router.post('/login', function(req, res, next){
    if(!req.body.user || !req.body.pass){
        return res.status(400).json({ message: 'Please fill out all fields'});   
    }
    
    passport.authenticate('local', function(err, user, info){
        if(err){
            return next(err);
        }
        if(user){
            return res.json({
                token: user.jwt   
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.param('jNo', function(req, res, next, jNo){
  Model.Results.findOne({
      where: { 
          job_id: jNo 
      } 
  }).then(function(results){
      if(!results) { return next(new Error('Can\'t find job')); }
      req.results = results;
      return next();
  }).catch(function(error) {
      //req.flash('error', "Something went wrong!")
      res.redirect('/home')
  });
});

router.get('/job/:jNo/fetchResults', function(req, res, next){
  res.json(req.results);
});

router.get('/job/:jNo/get/:downloadType/*?', function(req, res, next){
  switch(req.params.downloadType){
    case 'f':
      console.log('f');
      break;
    case 't':
      console.log('t');
      break;
    case 'z':
      console.log('z');
      break;
    default:
      req.flash('error', "Errenous download type");
      res.redirect('/home');
  }
  
  res.json({ test: req.params[0] });
});

module.exports = router;
