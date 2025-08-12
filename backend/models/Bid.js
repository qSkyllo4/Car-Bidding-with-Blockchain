const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Car = require('./Car');

const Bid = sequelize.define('Bid', {
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
}, {
  timestamps: true
});


Bid.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Bid, { foreignKey: 'user_id' });

Bid.belongsTo(Car, { foreignKey: 'car_id' });
Car.hasMany(Bid, { foreignKey: 'car_id' });

module.exports = Bid;
