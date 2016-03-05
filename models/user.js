'use strict';

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define('user', {
    slack_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    real_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return User;
};
