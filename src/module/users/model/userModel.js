const { Sequelize, Model, DataTypes, } = require('sequelize')

module.exports = class UserModel extends Model {
    /**
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @returns {typeof UserModel}
    */
    static setup(sequelizeInstance) {
        UserModel.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                    unique: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
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
                modelName: 'users',
                timestamps: false,
            }
        );

        return UserModel;
    }
}
