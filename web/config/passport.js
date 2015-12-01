var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var Model = require('../models/models.js');

passport.use(new LocalStrategy({
        usernameField: 'user',
        passwordField: 'pass'
    },
    function (username, password, done) {
        Model.User.findOne({
            where: {
                'email': username
            }
        }).then(function (user) {
            if (user == null) {
              console.log("incorrect user");
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            var hPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64).toString('hex');
            
            if (user.password !== hPassword) {
              console.log("incorrect pass");
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));

/*
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var crypto = require('crypto');
var Model = require('../models/models.js');

module.exports = function(app) {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
      usernameField: 'user',
      passwordField: 'pass'
    },
    function(username, password, done) {
      Model.User.findOne({
        where: {
          'username': username
        }
      }).then(function (user) {
        if (user == null) {
          return done(null, false, { message: 'Incorrect credentials.' })
        }
        
        var hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64).toString('hex');
        
        if (user.password === hashedPassword) {
          return done(null, user)
        }
        
        return done(null, false, { message: 'Incorrect credentials.' })
      })
    }
  ))

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    Model.User.findOne({
      where: {
        'id': id
      }
    }).then(function (user) {
      if (user == null) {
        done(new Error('Wrong user id.'))
      }
      
      done(null, user)
    })
  })
}*/