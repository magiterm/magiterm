'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserDockerStats = sequelize.define('UserDockerStats', {
    userId: DataTypes.STRING,
    stats: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return UserDockerStats;
};
