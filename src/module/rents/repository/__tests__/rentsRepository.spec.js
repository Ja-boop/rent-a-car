/// <reference types="Jest" />

const { Sequelize } = require('sequelize');
const ReserveRepository = require('../orm/rentsRepository');
const ReserveModel = require('../../model/rentModel');
const CarModel = require('../../../cars/model/carModel');
const ClientModel = require('../../../clients/model/clientModel');
const ReserveNotFoundError = require('../orm/error/reserveNotFoundError');
const ReserveIdNotDefinedError = require('../orm/error/reserveIdNotDefinedError');
const createTestReserve = require('../../controller/__tests__/reserve.fixture');
const createTestCar = require('../../../cars/controller/__tests__/cars.fixture');
const createTestClient = require('../../../clients/controller/__tests__/client.fixture');

const sequelizeInstance = new Sequelize('sqlite::memory');

/**
 * @type ReserveRepository
 */
let repository;

beforeEach(async (done) => {
    const reserve = ReserveModel.setup(sequelizeInstance);
    CarModel.setup(sequelizeInstance);
    ClientModel.setup(sequelizeInstance);
    reserve.setupCarAssociations(CarModel);
    reserve.setupClientAssociations(ClientModel);

    repository = new ReserveRepository(reserve, CarModel, ClientModel);
    await sequelizeInstance.sync({force: true});
    done();
});

test('Crea un alquiler cuando la entidad no tiene id', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    const reserve = await repository.rentCar(reserveWithoutId);

    expect(reserve.id).toEqual(1);    
});

test('Actualiza un alquiler cuando la entidad tiene un id', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    const reserve = await repository.rentCar(reserveWithoutId);
    console.log(reserve)
    reserve.Client = { id: 1 }; 
    reserve.Car = { id: 1 };
    

    expect(reserve.id).toEqual(1); 

    reserve.finalCost = 30000;

    const modifiedReserve = await repository.rentCar(reserve);
    expect(modifiedReserve.id).toEqual(1);
    expect(modifiedReserve.finalCost).toEqual(30000);
});

test('Buscar un alquiler por ID', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    await repository.rentCar(reserveWithoutId);

    const reserve = await repository.getReserveById(1);
    expect(reserve.id).toEqual(1);
});

test('Buscar todas las reservas', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    await repository.rentCar(reserveWithoutId);

    const secondReserveWithoutId = createTestReserve();
    await repository.rentCar(secondReserveWithoutId);

    const reserve = await repository.getAllReserves();
    expect(reserve).toHaveLength(2);
    
});

test('Buscar todas las reservas de un usuario', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    await repository.rentCar(reserveWithoutId);

    const secondReserveWithoutId = createTestReserve();
    await repository.rentCar(secondReserveWithoutId);

    const userReservations = await repository.getUserReserve(1);
    expect(userReservations).toHaveLength(2);
});

test('Borrar una reserva existente devuelve true', async () => {
    const reserveWithoutId = createTestReserve();
    const carWithId = createTestCar(1);
    const clientWithId = createTestClient(1);
    await CarModel.create(carWithId);
    await ClientModel.create(clientWithId);
    const reserve = await repository.rentCar(reserveWithoutId);

    await expect(repository.deleteReserve(reserve)).resolves.toEqual(true);
    await expect(repository.getReserveById(1)).rejects.toThrow(ReserveNotFoundError);
});

test('Borrar una reserva sin parametros da error', async () => {
    await expect(repository.deleteReserve()).rejects.toThrow(ReserveIdNotDefinedError);
});

test('Buscar una reserva inexistente da error', async () => {
    try {
        await repository.getUserReserve()
    } catch (e) {
        expect(e).toEqual(new ReserveNotFoundError)
    }
    
}); 
