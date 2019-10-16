'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserSession = sequelize.define('UserSession', {
    token: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    renewToken: {
      type: DataTypes.STRING,
      unique: true,
    },
    expire: DataTypes.DATE,
    fcmToken: DataTypes.STRING,
  }, {});
  UserSession.associate = function (models) {
    UserSession.belongsTo(models.User, { as: 'user' });
  };
  UserSession.fSchema = {
    type: 'object',
    properties: {
      token: { type: 'string' },
      renewToken: { type: 'string' },
      expire: { type: 'string', format: "date" },
      fcmToken: { type: 'string' },
      userId: { type: 'string' },
      user: { type: 'object', description: "User model" },
    }
  };
  return UserSession;
};