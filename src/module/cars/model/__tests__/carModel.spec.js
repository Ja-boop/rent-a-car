const { Sequelize } = require('sequelize');
const CarModel = require('../carModel');

const sequelizeInstance = new Sequelize('sqlite::memory');

test('Después de hacerle un setup a Car Model y sincronizar el modelo, la tabla Cars existe', async () => {
    CarModel.setup(sequelizeInstance);
    await CarModel.sync({ force: true });
    expect(await CarModel.findAll()).toEqual([]);
});
