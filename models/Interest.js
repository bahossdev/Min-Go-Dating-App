const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Interest extends Model {}


Interest.init(
  {
    // Defining columns
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    interest_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'interest',
  }
);

module.exports = Interest;
