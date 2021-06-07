/// <reference types="Jest" />

const ClientService = require('../clientsService');
const Client = require('../../entity/client');
const ClientNotDefinedError = require('../error/clientNotDefinedError');
const ClientIdNotDefinedError = require('../error/clientIdNotDefinedError');

const repositoryMock = {
    saveClient: jest.fn(),
    getClientById: jest.fn(),
    deleteClient: jest.fn(),
    getAllClients: jest.fn(),
}

const clientService = new ClientService(repositoryMock);

test('Guardar un cliente llama al metodo saveClient 1 vez', async () => {
    clientService.saveClient({});
    expect(repositoryMock.saveClient).toHaveBeenCalledTimes(1);
});

test('Llamar a guardar un cliente sin dar un parametro especifico da un error especifico', async () => {
    expect(clientService.saveClient).rejects.toThrow(ClientNotDefinedError);
});

test('Eliminar un cliente llama al metodo deleteClient 1 vez', () => {
    clientService.deleteClient(new Client({ id: 1 }));
    expect(repositoryMock.deleteClient).toHaveBeenCalledTimes(1);
});

test('Llamar a eliminar un cliente sin pasar un cliente da un error especifico', async () => {
    await expect(clientService.deleteClient).rejects.toThrow(ClientNotDefinedError);
})

test('Consultar por un cliente llama al metodo getClientById 1 vez', () => {
    clientService.getClientById(1);
    expect(repositoryMock.getClientById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un cliente sin pasar un cliente da un error especifico', () => {
    expect(clientService.getClientById).rejects.toThrow(ClientIdNotDefinedError);
});

test('Consultar por todos los clientes llama al metodo getAllClients del repositorio 1 vez', () => {
    clientService.getAllClients();
    expect(repositoryMock.getAllClients).toHaveBeenCalledTimes(1);
});

