var Sequelize = require('sequelize')

var attributes = {
  required: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options