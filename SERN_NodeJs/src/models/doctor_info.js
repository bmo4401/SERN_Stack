'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call    this method automatically.
         */
        static associate(models) {
            Doctor_infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceIdData' });
            Doctor_infor.belongsTo(models.Allcode, {
                foreignKey: 'provinceId',
                targetKey: 'keyMap',
                as: 'provinceIdData',
            });
            Doctor_infor.belongsTo(models.Allcode, {
                foreignKey: 'paymentId',
                targetKey: 'keyMap',
                as: 'paymentIdData',
            });
            //     User.belongsTo(models.Allcode, { foreignKey: "gender", targetKey: "keyMap", as: "genderData" })
            //     User.hasOne(models.Markdown, { foreignKey: "doctorId" })
        }
    }
    Doctor_infor.init(
        {
            doctorId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Doctor_infor',
            freezeTableName: true,
        },
    );
    return Doctor_infor;
};
