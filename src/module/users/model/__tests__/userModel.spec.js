const { Sequelize } = require('sequelize');
const UserModel = require('../UserModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a User Model y sincronizar el modelo, la tabla Users existe', async () => {
    UserModel.setup(sequelizeInstance);
    await UserModel.sync({ force: true });
    expect(await UserModel.findAll()).toEqual([]);
});