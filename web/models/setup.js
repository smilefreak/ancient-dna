var Model = require('./models.js')
  Model.User.sync({ force: true }).then(function() {
    // create username with username: user and 
    // password: user
    Model.User.create({
      email: 'apple@test.com',
      password: 'apple'
    }).then(function() {
        process.exit();
    })
  })