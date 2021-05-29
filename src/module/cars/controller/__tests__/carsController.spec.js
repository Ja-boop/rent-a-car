const CarController = require('../carsController');
const Car = require('../../entity/car');

const { paths } = require('../paths/paths');
const { resData } = require('../../../data/resData');

const serviceMock = {
    saveCar: jest.fn(),
    deleteCar: jest.fn(() => Promise.resolve(true)),
    getCarById: jest.fn(() => Promise.resolve({})),
    getAllCars: jest.fn(() => Promise.resolve([])),
};

const controller = new CarController({}, serviceMock);

test('car_list renderea list', async () => {
    const renderMock = jest.fn();
    const car = [];
    await controller.car_list({}, { render: renderMock });

    expect(serviceMock.getAllCars).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.list.render, { data: { car }, resData })
});

test('car_form renderea form', async () => {
    const renderMock = jest.fn();
    serviceMock.getAllCars();
    await controller.car_form({}, { render: renderMock });

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.create.render, { resData });
});

test('save_car llama al servicio con el body(con ID) y redirecciona a list', async () => {
    const redirectMock = jest.fn();
    const FAKE_CAR_IMAGE_URL = 'ejemplo/car.png';
    const bodyMock = new Car({
        id: 1,
        brand: undefined,
        model: undefined,
        imageUrl: FAKE_CAR_IMAGE_URL,
        yearManufactured: undefined,
        kms: undefined,
        color: undefined,
        airConditioner: undefined,
        passengers: undefined,
        transmission: undefined,
        cost: undefined,
    });

    await controller.save_car(
        { body: bodyMock, file: { path: FAKE_CAR_IMAGE_URL }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.saveCar).toHaveBeenCalledTimes(1);
    expect(serviceMock.saveCar).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.list.path)
});

test('save_car llama al servicio con el body(sin ID) y redirecciona a list', async () => {
    const redirectMock = jest.fn();
    const FAKE_CAR_IMAGE_URL = 'ejemplo/car.png';
    const bodyMock = new Car({
        id: 0,
        brand: 'BMW',
        model: 'M3 GTR',
        imageUrl: FAKE_CAR_IMAGE_URL,
        yearManufactured: undefined,
        kms: undefined,
        color: undefined,
        airConditioner: undefined,
        passengers: undefined,
        transmission: undefined,
        cost: undefined,
    });
    serviceMock.saveCar.mockImplementationOnce(() => Promise.resolve(bodyMock))

    await controller.save_car(
        { body: bodyMock, file: { path: FAKE_CAR_IMAGE_URL }, session: {} },
        { redirect: redirectMock }
    );

    expect(serviceMock.saveCar).toHaveBeenCalledTimes(2); // Si pongo que llamo a saveCar 1 vez, falla porque tambien llama en el test anterior, funciona solo si aislamos el test
    expect(serviceMock.saveCar).toHaveBeenCalledWith(bodyMock);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.list.path)
});

test('Llamo a guardar un auto con ID null, da un error y redirecciona a list', async () => {
    const redirectMock = jest.fn();
    const FAKE_CAR_IMAGE_URL = 'ejemplo/car.png';
    const bodyMock = new Car({
        id: null,
        brand: undefined,
        model: undefined,
        imageUrl: FAKE_CAR_IMAGE_URL,
        yearManufactured: undefined,
        kms: undefined,
        color: undefined,
        airConditioner: undefined,
        passengers: undefined,
        transmission: undefined,
        cost: undefined,
    });
    
    
    await controller.save_car(
        { body: bodyMock, file: { path: FAKE_CAR_IMAGE_URL }, session: {} },
        { redirect: redirectMock }
    );
    
    
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.list.path)
});

test('Delete llama al servicio con el id del body y redirecciona a list', async () => {
    const FAKE_CAR = new Car({ id: 1 });
    serviceMock.getCarById.mockImplementationOnce(() => Promise.resolve(FAKE_CAR));
    const redirectMock = jest.fn();

    await controller.delete_car({ params: { id: 1 }, session: {} }, { redirect: redirectMock });

    expect(serviceMock.deleteCar).toHaveBeenCalledTimes(1);
    expect(serviceMock.deleteCar).toHaveBeenCalledWith(FAKE_CAR);
    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenLastCalledWith(paths.list.path);
});

test('update_car renderea form', async () => {
    const renderMock = jest.fn();
    const carId = 1;
    const car = new Car({ id: carId });
    serviceMock.getCarById.mockImplementationOnce(() => Promise.resolve(car));

    await controller.update_car({ params: { id: 1 }, session: {} }, { render: renderMock });

    expect(serviceMock.getCarById).toHaveBeenCalledTimes(2);
    expect(serviceMock.getCarById).toHaveBeenCalledWith(carId);
    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(paths.create.render, { data: { car } })
});

test('update_car con id null', async () => {
    try {
        await controller.update_car({ params: {} })
    } catch (e) {
        expect(e).toEqual(Error('No se encontro el vehículo con el ID'))
    }
});

test('update_car con un getCarById rechazado da error y redirecciona a list', async () => {
    const redirectMock = jest.fn();
    const renderMock = jest.fn();
    const car = new Car({ id: 1 });
    serviceMock.getCarById.mockImplementationOnce(() => Promise.reject(car));

    try {
        await controller.update_car({params: { id: car.id }, session: {} }, { render: renderMock, redirect: redirectMock });
        
    } catch (e) {
        expect(e).toEqual(e);
    }

    expect(redirectMock).toHaveBeenCalledTimes(1);
    expect(redirectMock).toHaveBeenCalledWith(paths.list.path);
});
