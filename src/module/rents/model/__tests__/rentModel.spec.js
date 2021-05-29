const { Sequelize } = require('sequelize');
const ReserveModel = require('../rentModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a Reserve Model y sincronizar el modelo, la tabla Reserves existe', async () => {
    ReserveModel.setup(sequelizeInstance);
    await ReserveModel.sync({ force: true });
    expect(await ReserveModel.findAll()).toEqual([]);
});