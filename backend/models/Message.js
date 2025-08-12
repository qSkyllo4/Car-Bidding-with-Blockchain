const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Message = sequelize.define('Message', {
  name:  { type: DataTypes.STRING,  allowNull: false },
  email: { type: DataTypes.STRING,  allowNull: false },
  body:  { type: DataTypes.TEXT,    allowNull: false }
});

Message.belongsTo(User, { foreignKey: 'user_id', allowNull: true });
User.hasMany(Message, { foreignKey: 'user_id' });

module.exports = Message;
