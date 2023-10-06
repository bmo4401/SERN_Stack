'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call    this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcode, { foreignKey: "positionId", targetKey: "keyMap", as: "positionData" })
            User.belongsTo(models.Allcode, { foreignKey: "gender", targetKey: "keyMap", as: "genderData" })
            User.hasOne(models.Markdown, { foreignKey: "doctorId" })
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            address: DataTypes.STRING,
            gender: DataTypes.STRING,
            roleid: DataTypes.STRING,
            phonenumber: DataTypes.STRING,
            positionId: DataTypes.STRING,
            image: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
