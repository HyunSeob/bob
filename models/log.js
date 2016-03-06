'use strict';

module.exports = function(sequelize, DataTypes) {
  let Log = sequelize.define('Log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return Log;
};
