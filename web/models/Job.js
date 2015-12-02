var Sequelize = require('sequelize')

var attributes = {
  name: {
    type: Sequelize.STRING
  },
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  owner: {
    type: Sequelize.STRING 
  },
  params: {
    type: Sequelize.JSONB
  }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options