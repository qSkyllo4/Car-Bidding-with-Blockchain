
const { DataTypes } = require('sequelize');
const sequelize      = require('../config/database');
const User           = require('./User');

const Car = sequelize.define('Car', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kilometers: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  features: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },

  starting_price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('pending','approved','declined'),
    allowNull: false,
    defaultValue: 'pending'
  },

  txHash: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Car.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Car,   { foreignKey: 'user_id' });

module.exports = Car;
