console.log("Loading Model.js");
var Model = require('./models.js')
console.log("Loading Sequelize");
var connection = require('../sequelize.js')

console.log("Attempting to setup database")
connection.sync({
  force: true,
  logging: console.log
})