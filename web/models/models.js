var UserMeta = require('./User.js'),
    ResultsMeta = require('./Results.js'),
    connection = require('../sequelize.js')

var User = connection.define('users', UserMeta.attributes, UserMeta.options)
var Results = connection.define('job_results', ResultsMeta.attributes, ResultsMeta.options) 
// you can define relationships here

module.exports.User = User
module.exports.Results = Results