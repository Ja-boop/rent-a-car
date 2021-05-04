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
                takeDay: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                returnDay: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                finalCost: {
                    type: DataTypes.INTEGER,
                    allowNull: false,       
                },
                payment: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
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
                modelName: 'Reserves',
                timestamps: false,
            }   
        );

        return RentModel;
    }

    /**
     * @param {import('../../cars/model/carModel')} CarModel
     */
    static setupCarAssociations(CarModel) {
        RentModel.belongsTo(CarModel, { foreignKey: 'car_id' });
    }

    static setupClientAssociations(ClientModel) {
        RentModel.belongsTo(ClientModel, { foreignKey: 'client_id' });
    }

};
