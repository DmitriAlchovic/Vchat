'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
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
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('users');
  }
};