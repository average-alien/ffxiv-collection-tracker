'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.emote.belongsTo(models.user)
    }
  }
  emote.init({
    apiId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    obtained: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'emote',
  });
  return emote;
};