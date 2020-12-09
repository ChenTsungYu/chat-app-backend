'use strict';

const bcrypt = require('bcrypt')
const config = require('../config/app')

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.Chat, { through: 'ChatUser', foreignKey: 'userId' });
            this.hasMany(models.ChatUser, { foreignKey: 'userId' });
        }
    };
    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        gender: DataTypes.STRING,
        avator: {
            type: DataTypes.STRING,
            get() {
                const avator = this.getDataValue('avator')
                const url = `${config.appUrl}:${config.appPort}`

                if (!avator) {
                    return `${url}/${this.getDataValue('gender')}.svg`
                }

                const id = this.getDataValue('id')
                return `${url}/user/${id}/${avator}`
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    });
    return User;
};

const hashPassword = async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    return user
}