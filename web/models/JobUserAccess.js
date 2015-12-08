var Sequelize = require('sequelize')

var attributes = {
  public: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options