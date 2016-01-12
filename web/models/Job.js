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
  },
  status: {
    type: Sequelize.ENUM('Processing', 'Complete', 'Failed', 'Paused', 'UNKNOWN'),
    defaultValue: 'Processing',
    allowNull: false
  },
  progress: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: { min: 0, max: 100 }
  }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options
