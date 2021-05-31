const ReserveController = require('../reserveController');
const Reserve = require('../../entity/reserve');
const Car = require('../../../cars/entity/car');
const Client = require('../../../clients/entity/client');

const { paths } = require('../paths/paths');
const { resData } = require('../../../data/resData');
const getCurrentDate = require('../../service/functions');

const reserveServiceMock = {
    rentCar: jest.fn(),
    getUserReserve: jest.fn(),
    getReserveById: jest.fn(),
    deleteReserve: jest.fn(),
    getAllReserves: jest.fn(),
};

const carServiceMock = {
    saveCar: jest.fn(),
    deleteCar: jest.fn(() => Promise.resolve(true)),
    getCarById: jest.fn(() => Promise.resolve({})),
    getAllCars: jest.fn(() => Promise.resolve([])),
};

const clientServiceMock = {
    saveClient: jest.fn(),
    getClientById: jest.fn(),
    deleteClient: jest.fn(),
    getAllClients: jest.fn(),
}

const controller = new ReserveController(reserveServiceMock, carServiceMock, clientServiceMock);

test('controller.index renderea index', async () => {
    const renderMock = jest.fn();
    await controller.index({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.index.render, { resData });
});

test('controller.list renderea list', async () => {
    const renderMock = jest.fn();
    const cars = {
        firstCar: new Car({ id: 1 }),
        secondCar: new Car({ id: 2 }),
    };
    carServiceMock.getAllCars.mockImplementationOnce(() => Promise.resolve(cars));
    await controller.list({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.list.render, { data: { cars }, resData })
});

test('controller.form renderea form', async () => {
    let currentDate = getCurrentDate();
    const renderMock = jest.fn();
    const car = new Car({ id: 1 });
    carServiceMock.getCarById.mockImplementationOnce(() => Promise.resolve(car));

    const clients = {
        firstClient: new Client({ id: 1 }),
        secondClient: new Client({ id: 2 }),
    };
    clientServiceMock.getAllClients.mockImplementationOnce(() => Promise.resolve(clients));

    await controller.form({ params: { id: 1 }, session: {} }, { render: renderMock});

    expect(carServiceMock.getCarById).toHaveBeenCalledTimes(1);
    expect(carServiceMock.getCarById).toHaveBeenCalledWith(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.create.render, { currentDate, data: { clients, car }, resData});
});

test('controller.form con id undefined da error', async () => {
    const mockRes = { redirect: jest.fn() };
    const mockReq = { params: { id: undefined} ,session: {} };
    try {
        await controller.form(mockReq, mockRes);
    } catch (e) {
        expect(e).toEqual(Error('id undefined'));
    }
});

test('controller.form sin parametros da error', async () => {
    const mockRes = { redirect: jest.fn() };
    const mockReq = { params: { id: 1} ,session: {} };
    await controller.form(mockReq, mockRes);

    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(paths.reserve.list.path);
});

test('controller.save llama al servicio con el body(con ID) y redirecciona a list', async () => {
    const car_id = 1;
    const client_id = 1;

    const bodyMock = {
        id: 1,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        car_id,
        client_id
    };

    const savedReserve = {
        id: 1,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        Car: new Car({ id: Number(car_id) }),
        Client: new Client({ id: Number(client_id) }),
    };

    const mockRes = { redirect: jest.fn() };
    const mockReq = { body: bodyMock, session: {} };
    
    await controller.save(mockReq, mockRes);

    expect(reserveServiceMock.rentCar).toHaveBeenCalledTimes(1);
    expect(reserveServiceMock.rentCar).toHaveBeenCalledWith(savedReserve);
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(paths.reserve.list.redirect(savedReserve.Client.id))
});

test('controller.save llama al servicio con el body(sin ID) y redirecciona a list', async () => {
    const car_id = 1;
    const client_id = 1;

    const bodyMock = {
        id: 0,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        car_id,
        client_id
    };

    reserveServiceMock.rentCar.mockImplementationOnce(() => Promise.resolve(bodyMock))

    const savedReserve = new Reserve({
        id: 1,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        Car: new Car({ id: Number(car_id) }),
        Client: new Client({ id: Number(client_id) }),
    });

    const mockRes = { redirect: jest.fn() };
    const mockReq = { body: bodyMock, session: {} };
    
    await controller.save(mockReq, mockRes);

    expect(reserveServiceMock.rentCar).toHaveBeenCalledTimes(2);
    expect(reserveServiceMock.rentCar).toHaveBeenCalledWith(savedReserve);
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(paths.reserve.list.redirect(savedReserve.Client.id))
});

test('controller.save llama al servicio con id null, da error y redirecciona a la lista de autos', async () => {
    const car_id = 1;
    const client_id = 1;

    const bodyMock = {
        id: null,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        car_id,
        client_id
    };

    const mockRes = { redirect: jest.fn() };
    const mockReq = { body: bodyMock, session: {} };
    
    await controller.save(mockReq, mockRes);

    expect(reserveServiceMock.rentCar).toHaveBeenCalledTimes(3);
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(paths.list.path)
});

test('controller.client_selector renderea el selector de clientes', async () => {
    const client = undefined

    const mockRes = { render: jest.fn() };
    const mockReq = { session: {} };

    await controller.client_selector(mockReq, mockRes);
    expect(clientServiceMock.getAllClients).toHaveBeenCalledTimes(3);
    expect(mockRes.render).toHaveBeenCalledWith(paths.reserve.client.selector.render, { data: { client }, resData })
});

test('controller.client_reserves renderea clientList', async () => {
    const mockRes = { render: jest.fn() };
    const mockReq = { params: { id: 1 } ,session: {} };
    const reserve = new Reserve({ Client: { id: 1 } });
    reserveServiceMock.getUserReserve.mockImplementationOnce(() => Promise.resolve(reserve));

    await controller.client_reserves(mockReq, mockRes);
    expect(mockRes.render).toHaveBeenCalledWith(paths.reserve.list.render, { data: { reserve }, resData })
});

test('controller.client_reserves sin parametros da error', async () => {
    try {
        await controller.client_reserves({ params: {} });
    } catch (e) {
        expect(e).toEqual(Error('id undefined'));
    }
});

test('controller.delete_reserve elimina una reserva y redirecciona a las reservas del cliente', async () => {
    const FAKE_RESERVE = new Reserve({ id: 1, Client: { id: 1 } });
    reserveServiceMock.getReserveById.mockImplementationOnce(() => Promise.resolve(FAKE_RESERVE));
    const reqMock = { params: { id: 1 } ,session: {} };
    const resMock = { redirect: jest.fn() };

    await controller.delete_reserve(reqMock, resMock);

    expect(reserveServiceMock.deleteReserve).toHaveBeenCalledTimes(1);
    expect(reserveServiceMock.deleteReserve).toHaveBeenCalledWith(FAKE_RESERVE);
    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenLastCalledWith(paths.reserve.delete.redirect(1));
});

test('controller.delete_reserve sin parametros da error', async () => {
    try {
        await controller.delete_reserve({ params: {} });
    } catch (e) {
        expect(e).toEqual(Error('id undefined'));
    }
});

test('controller.view_reserve renderea el update', async () => {
    let currentDate = getCurrentDate();
    const reserve = new Reserve({ id: 1 });
    reserveServiceMock.getReserveById.mockImplementationOnce(() => Promise.resolve(reserve));

    const reqMock = { params: { id: 1 } ,session: {} };
    const resMock = { render: jest.fn() };
    await controller.view_reserve(reqMock, resMock);
    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenCalledWith(paths.reserve.update.render, { currentDate, data: { reserve }, resData });
});

test('controller.view_reserve sin parametros da error', async () => {
    try {
        await controller.view_reserve({ params: {} });
    } catch (e) {
        expect(e).toEqual(Error('id undefined'));
    }
});

test('controller.update_reserve llama al servicio y redirecciona a list', async () => {
    const car_id = 1;
    const client_id = 1;

    const bodyMock = {
        id: 1,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        car_id,
        client_id
    };

    const savedReserve = {
        id: 1,
        takeDay: undefined,
        returnDay: undefined,
        payment: undefined,
        status: undefined,
        finalCost: undefined,
        Car: new Car({ id: Number(car_id) }),
        Client: new Client({ id: Number(client_id) }),
    };

    const mockRes = { redirect: jest.fn() };
    const mockReq = { body: bodyMock, session: {} };
    
    await controller.update_reserve(mockReq, mockRes);

    expect(reserveServiceMock.rentCar).toHaveBeenCalledTimes(4);
    expect(reserveServiceMock.rentCar).toHaveBeenCalledWith(savedReserve);
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
    expect(mockRes.redirect).toHaveBeenCalledWith(paths.reserve.list.redirect(savedReserve.Client.id))
});

test('controller.update_reserve falla y redirecciona a list', async () => {
    const reserve = undefined;
    const reqMock = { body: reserve, session: {} };
    const resMock = { redirect: jest.fn() };

    await controller.update_reserve(reqMock, resMock);
    expect(resMock.redirect).toHaveBeenCalledWith(paths.reserve.client.selector.path)
});
