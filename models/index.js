'use strict';

require('dotenv').config();
const path      = require('path');
const Sequelize = require('sequelize');
const env       = process.env.NODE_ENV || 'development';
const config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, config);

let User   = sequelize.import(path.join(__dirname, 'user'));
let Place  = sequelize.import(path.join(__dirname, 'place'));
let Rating = sequelize.import(path.join(__dirname, 'rating'));
let Log    = sequelize.import(path.join(__dirname, 'log'));

// Define relations
User.hasMany(Place);
Place.belongsTo(User);

User.hasMany(Rating);
Place.hasMany(Rating);
Rating.belongsTo(User);
Rating.belongsTo(Place);

User.hasMany(Log);
Place.hasMany(Log);
Log.belongsTo(User);
Log.belongsTo(Place);

let db = {};

db.User      = User;
db.Place     = Place;
db.Rating    = Rating;
db.Log       = Log;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
