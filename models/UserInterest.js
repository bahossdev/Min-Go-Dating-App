const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserInterest extends Model { }

UserInterest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
          },
        interest_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'interest',
                key: 'id',
            },
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'userInterest',
    }
);

module.exports = UserInterest;
