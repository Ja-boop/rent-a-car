const { Sequelize, Model, DataTypes, } = require('sequelize')

module.exports = class CarModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof CarModel}
    */
    static setup(sequelizeInstance) {
        CarModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                brand: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                model: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                imageUrl: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                yearManufactured: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                kms: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                color: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                airConditioner: {
                    type: DataTypes.BOOLEAN,
                },
                passengers: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                transmission: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                cost: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                lastUpdated: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: Sequelize.NOW,
                },
            },
            {
                sequelize: sequelizeInstance,
                modelName: 'Cars',
                timestamps: false,
            }   
        );

        return CarModel;
    }
}
