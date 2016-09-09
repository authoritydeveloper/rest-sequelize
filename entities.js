var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:@localhost:3306/node_sequelize');

var entities = {};

entities.user = sequelize.import('./models/User.js')
entities.sequelize = sequelize;
entities.Sequelize = Sequelize;

module.exports = entities;