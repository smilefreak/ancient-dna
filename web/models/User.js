var Sequelize = require('sequelize')
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var attributes = {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING,
    set: function(val) {
        this.setDataValue('salt', crypto.randomBytes(16).toString('hex'));
        this.setDataValue('password', crypto.pbkdf2Sync(val, this.salt, 1000, 64).toString('hex'));
    }
  },
  salt: {
    type: Sequelize.STRING
  }
}

var options = {
    freezeTableName: true,
    getterMethods: {
        jwt: function() {
            var today = new Date();
            var exp = new Date(today);
            exp.setDate(today.getDate() + 60);
            
            return jwt.sign({
                name: this.name,
                email: this.email,
                exp: parseInt(exp.getTime() / 1000)
            }, 'SECRET');
        }
    }
}

module.exports.attributes = attributes
module.exports.options = options