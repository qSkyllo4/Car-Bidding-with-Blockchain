const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt   = require('bcryptjs');

const User = sequelize.define('User', {
  name:     { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role:     { type: DataTypes.ENUM('user','admin'), allowNull: false, defaultValue: 'user' }
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

module.exports = User;
