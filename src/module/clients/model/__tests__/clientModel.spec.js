const { Sequelize } = require('sequelize');
const ClientModel = require('../clientModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a Client Model y sincronizar el modelo, la tabla Clients existe', async () => {
    ClientModel.setup(sequelizeInstance);
    await ClientModel.sync({ force: true });
    expect(await ClientModel.findAll()).toEqual([]);
});
