'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

let db = {};

fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.map(function(file) {
  let model = sequelize.import(path.join(__dirname, file));
  let className = model.name.charAt(0).toUpperCase() + model.name.substring(1, model.name.length);
  db[className] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
