var Sequelize = require('sequelize')

var attributes = {
    job_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    base_path: {
        type: Sequelize.TEXT  
    },
    files: {
        type: Sequelize.JSONB   
    }
}

var options = {
    freezeTableName: true,
    timestamps: false
}

module.exports.attributes = attributes
module.exports.options = options