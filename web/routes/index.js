var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var Model = require('../models/models.js')
var archiver = require('archiver');

//Hardcoded secret should be moved to a seperate file
var auth = jwt({
  secret: 'SECRET',
  userProperty: 'payload'
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/newJob', auth, function (req, res, next) {
  if(!req.body.name){
    return res.status(400).json({
      message: 'Please fill out all required fields.'
    });
  }
  Model.User.findOne({
    where: {
      email: req.payload.email
    }
  }).then(function (user) {
    user.createJob({
      name: req.body.name 
    }).then(function (job) {
      res.json({
        job: job
      });
    }).catch(function (error) {
      console.log(error);
      res.redirect('/home')
    });
  }).catch(function (error) {
    console.log(error);
    res.redirect('/home')
  });
});

router.post('/register', function (req, res, next) {
  if (!req.body.user || !req.body.pass) {
    return res.status(400).json({
      incomplete: true
    });
  }
  Model.User.create({
    name: req.body.name,
    email: req.body.user,
    password: req.body.pass
  }).then(function (user) {
    return res.json({
      token: user.jwt
    })
  }).catch(function (error) {
    rJson = {}
    //Change to switch for more than one error check
    if(error.errors){
      error.errors.forEach(function(err){
        if(err.message == 'email must be unique'){
          rJson.unique = true;
        }
      });
    } else {
      rJson.default = true;
    }
    return res.status(400).json(rJson)
  });

});

router.post('/login', function (req, res, next) {
  if (!req.body.user || !req.body.pass) {
    return res.status(400).json({
      incomplete: true
    });
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.json({
        token: user.jwt
      });
    } else {
      rJson = {}
      switch(info.message){
        case 'Incorrect username.':
        case 'Incorrect password.':
          rJson.incorrect = true;
          break;
        default:
          rJson.default = true;
      }
      return res.status(401).json(rJson);
    }
  })(req, res, next);
});

router.param('jNo', function (req, res, next, jNo) {
  Model.Results.findOne({
    where: {
      id: jNo
    }
  }).then(function (results) {
    if (!results) {
      return next(new Error('Can\'t find job'));
    }
    req.results = results;
    return next();
  }).catch(function (error) {
    //req.flash('error', "Something went wrong!")
    res.redirect('/home')
  });
});

router.get('/job/:jNo/fetchResults', function (req, res, next) {
  res.json(req.results);
});

//Danger - prevent directory traversal
/*
router.get('/job/:jNo/get/:downloadType/*?', function(req, res, next){
  switch(req.params.downloadType){
    case 'f':
      console.log('f');
      return;
    case 't':
      var archiveType = "zip"; 
      break;
    case 'z':
      var archiveType = "tar";
      break;
    default:
      res.redirect('/home');
  }
  
  var archive = archiver(archiveType, { store: true });
  
  archive.on('error', function(err) {
    console.log(err.message);
    res.status(500).send({error: err.message});
  });

  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  res.attachment('test.' + archiveType);
  
  archive.pipe(res);
  archive.directory(req.params[0], false);
  archive.finalize();
});*/

router.get('/account', auth, function (req, res, next) {
  console.log('Finding all jobs for given user');
  Model.User.findOne({
    where: {
      email: req.payload.email
    }
  }).then(function (user) {
    user.getJobs().then(function (results) {
      res.json({
        results: results
      });
    }).catch(function (error) {
      res.redirect('/home')
    });
  }).catch(function (error) {
    res.redirect('/home')
  });
});

module.exports = router;