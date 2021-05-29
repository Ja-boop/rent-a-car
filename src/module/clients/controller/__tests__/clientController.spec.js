const ClientController = require('../clientsController');
const Client = require('../../entity/client');

const resData = require('../../../data/resData');
const { paths } = require('../paths/paths');

const serviceMock = {
    saveClient: jest.fn(),
    getClientById: jest.fn(),
    deleteClient: jest.fn(),
    getAllClients: jest.fn(),
};

const controller = new ClientController(serviceMock);

test('create renderea form.njk', async () => {
    const renderMock = jest.fn();
    await controller.create({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.create.render, resData);
});

test('save llama al servicio con el body(con ID) y redirecciona a index', async () => {
    const redirectMock = jest.fn();
    const bodyMock = new Client({
        id: 1,
        name: undefined,
        lastName: undefined,
        identifierType: undefined,
        identifierNumber: undefined,
        nationality: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        birthday: undefined,
    });

    await controller.save(
        { body: bodyMock, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.saveClient).toHaveBeenCalledTimes(1);
    expect(serviceMock.saveClient).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.index);
});

test('save llama al servicio con el body(sin ID) y redirecciona a index', async () => {
    const redirectMock = jest.fn();
    const bodyMock = new Client({
        id: 0,
        name: undefined,
        lastName: undefined,
        identifierType: undefined,
        identifierNumber: undefined,
        nationality: undefined,
        address: undefined,
        phone: undefined,
        email: undefined,
        birthday: undefined,
    });

    await controller.save(
        { body: bodyMock, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.saveClient).toHaveBeenCalledTimes(2);
    expect(serviceMock.saveClient).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.index);
});
