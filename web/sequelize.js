var Sequelize = require('sequelize');
var sequelize = new Sequelize('adna', 'postgres', 'test123', {
    dialect: 'postgres'
});

module.exports = sequelize;