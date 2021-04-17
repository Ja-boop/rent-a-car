const { Sequelize, Model, DataTypes, } = require('sequelize')

module.exports = class RentModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof RentModel}
    */
    static setup(sequelizeInstance) {
        RentModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                carId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                carImage: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                takeDay: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                returnDay: {
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
                modelName: 'reserves',
                timestamps: false,
            }   
        );

        return RentModel;
    }
}
