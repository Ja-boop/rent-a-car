const { Sequelize, Model, DataTypes, } = require('sequelize')

module.exports = class ClientModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof ClientModel}
    */
    static setup(sequelizeInstance) {
        ClientModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                identifierType: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                identifierNumber: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                nationality: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                phone: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                birthday: {
                    type: DataTypes.STRING,
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
                modelName: 'Clients',
                timestamps: false,
            }   
        );

        return ClientModel;
    }
}
