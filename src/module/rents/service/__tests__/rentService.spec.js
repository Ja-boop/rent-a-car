/// <reference types="Jest" />

const ReserveService = require('../rentsService');
const Reserve = require('../../entity/reserve');
const ReserveNotDefinedError = require('../error/reserveNotDefinedError');
const ReserveIdNotDefinedError = require('../error/reserveIdNotDefinedError');

const repositoryMock = {
    rentCar: jest.fn(),
    getUserReserve: jest.fn(),
    getReserveById: jest.fn(),
    deleteReserve: jest.fn(),
    getAllReserves: jest.fn(),
}

const reserveService = new ReserveService(repositoryMock);

test('Guardar una reserva llama al metodo rentCar 1 vez', async () => {
    reserveService.rentCar({});
    expect(repositoryMock.rentCar).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar una reserva sin dar un parametro da un error especifico', async () => {
    expect(reserveService.rentCar).rejects.toThrow(ReserveNotDefinedError);
});

test('Eliminar una reserva llama al metodo deleteReserve 1 vez', () => {
    reserveService.deleteReserve(new Reserve({ id: 1 }));
    expect(repositoryMock.deleteReserve).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un reserva sin pasar un reserva da un error especifico', async () => {
    await expect(reserveService.deleteReserve).rejects.toThrow(ReserveNotDefinedError);
})

test('Consultar por una reserva llama al metodo getReserveById 1 vez', () => {
    reserveService.getReserveById(1);
    expect(repositoryMock.getReserveById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar una reserva sin pasar un ID da un error especifico', () => {
    expect(reserveService.getReserveById).rejects.toThrow(ReserveIdNotDefinedError);
});

test('Consultar por todos los clientes llama al metodo getAllClients del repositorio 1 vez', () => {
    reserveService.getAllReserves();
    expect(repositoryMock.getAllReserves).toHaveBeenCalledTimes(1);
});

test('Consultar por la reserva de un cliente llama al metodo getUserReserve', async () => {
    reserveService.getUserReserve(1);
    expect(repositoryMock.getUserReserve).toHaveBeenCalledTimes(1);
});

test('Llamar a getUserReserve sin dar un ID da un error especifico', async () => {
    expect(reserveService.getUserReserve).rejects.toThrow(ReserveIdNotDefinedError);
});
