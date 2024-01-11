const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserMeetup extends Model { }

UserMeetup.init(
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
        meetup_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'meetup',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'userMeetup',
    }
);

module.exports = UserMeetup;
