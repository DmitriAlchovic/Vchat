'use strict';
const {
  Model, UUID
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class characters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  characters.init({
    charId:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false,
      primaryKey:true,
    },
    charName: {
      type: DataTypes.STRING,
      allowNull:false
    },
    rpSystem: DataTypes.STRING,
    discription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'characters',
  });
  characters.associate = function(models) {
    characters.belongsTo(models.users,{
      foreignKey:{
        name:'uuid',
        type: DataTypes.UUIDV4,
        allowNull:false
      }
    });
  };

  return characters;
};