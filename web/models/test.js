var Model = require('./models.js')

Model.User.findOne({
    where: {
      email: "joseph@saunderson.xyz"
    }
  }).then(function (user) {
      user.addJob(1)
});