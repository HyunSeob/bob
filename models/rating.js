'use strict';

module.exports = function(sequelize, DataTypes) {
  let Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

  return Rating;
};
