var Sequelize = require('sequelize')

var attributes = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: "job",
        key: "id"
    },
    base_path: {
        type: Sequelize.TEXT  
    },
    files: {
        type: Sequelize.JSONB   
    }
}

var options = {
    freezeTableName: true
}

module.exports.attributes = attributes
module.exports.options = options