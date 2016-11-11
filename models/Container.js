'use strict';
module.exports = function(sequelize, DataTypes) {
  var Container = sequelize.define('Container', {
    ownerID: DataTypes.STRING,
    collaboratorId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Container;
};