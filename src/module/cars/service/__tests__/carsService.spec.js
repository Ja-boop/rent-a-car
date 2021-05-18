/// <reference types="Jest" />

const CarsService = require('../carsService');
const Car = require('../../entity/car');
const CarNotDefinedError = require('../../repository/orm/error/carNotFoundError');
const CarIdNotDefinedError = require('../error/carIdNotDefinedError');

const repositoryMock = {
    saveCar: jest.fn(),
    deleteCar: jest.fn(),
    getCarById: jest.fn(),
    getAllCars: jest.fn(),
}

const carsService = new CarsService(repositoryMock);

test('Guardar un auto llama al metodo saveCar 1 vez', () => {
    carsService.saveCar({});
    expect(repositoryMock.saveCar).toHaveBeenCalledTimes(1);
});

test('LLamar a guardar un auto sin pasar un auto da un error especifico', async () => {
    await expect(carsService.saveCar).rejects.toThrowError(new CarNotDefinedError);
});

test('Eliminar un auto llama al metodo deleteCar 1 vez', () => {
    carsService.deleteCar(new Car({ id: 1 }));
    expect(repositoryMock.deleteCar).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un auto sin pasar un auto da un error especifico', async () => {
    await expect(carsService.deleteCar).rejects.toThrowError(new CarNotDefinedError);
})

test('Consultar por un auto llama al metodo getCarById 1 vez', () => {
    carsService.getCarById(1);
    expect(repositoryMock.getCarById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un auto sin pasar un auto da un error especifico', () => {
    expect(carsService.getCarById).rejects.toThrowError(new CarIdNotDefinedError);
});

test('Consultar por todos los autos llama al metodo getAllCars del repositorio 1 vez', () => {
    carsService.getAllCars();
    expect(repositoryMock.getAllCars).toHaveBeenCalledTimes(1);
});
