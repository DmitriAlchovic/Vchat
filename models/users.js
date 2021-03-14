'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize,DataTypes) => {
    class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    //**** HIDE userId from queris */
    //toJSON(){
      //return { ...this.get(),userId:undefined};
    //}
  };
  users.init({
    userId:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true,
    },
    uuid:{
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
    },
    nickname:{
      type: DataTypes.STRING,
      allowNull:false
    },
      email:{
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
      password:{
      type: DataTypes.STRING,
      allowNull:false
    }
   }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};