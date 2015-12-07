var Sequelize = require('sequelize')

var attributes = {
  md5: {
    type: Sequelize.STRING(128),
    primaryKey: true
  },
  file_path: {
    type: Sequelize.STRING 
  },
  size: {
    type: Sequelize.INTEGER,
    unsigned: true
  },
  uploader: {
    type: Sequelize.STRING 
  }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options