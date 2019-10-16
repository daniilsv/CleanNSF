'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    chooloId: DataTypes.BIGINT,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordSalt: DataTypes.STRING,
  }, {});
  User.associate = function (models) {

  };
  User.fSchema = {
    type: 'object',
    properties: {
      id: { type: "string" },
      chooloId: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      email: { type: 'string', description: "E-mail" },
      password: { type: 'string', description: "Пароль" },
      passwordSalt: { type: 'string', description: "Соль пароля" },
    }
  };
  return User;
};