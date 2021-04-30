const path = require('path');
const { default: DIContainer, object, get, factory } = require('rsdi');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { RentsRepository, RentsService, RentsController, RentModel } = require('../module/rents/module');   
const { CarsRepository, CarsService, CarsController, CarModel } = require('../module/cars/module');
const { UsersRepository, UsersService, UsersController, UserModel } = require('../module/users/module');
const { ClientsRepository, ClientsService, ClientsController, ClientModel } = require('../module/clients/module');

function configureSession() {
    const ONE_WEEK_IN_SECONDS = 604800000;

    const sessionOptions = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: ONE_WEEK_IN_SECONDS },
    };

    return session(sessionOptions);
}

function configureMulter() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, process.env.CARIMAGE_UPLOAD_DIR);
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    return multer({ storage });
}

function configureCarsMainDatabaseAdapterORM() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.CAR_DB_PATH,
    });

    return sequelize;
}

function configureCarModel(container) {
    CarModel.setup(container.get('CarsSequelize'));
    return CarModel;
}


function configureRentMainDatabaseAdapterORM() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.RESERVE_DB_PATH,
    });

    return sequelize;
}

function configureRentModel(container) {
    RentModel.setup(container.get('RentsSequelize'));
    return RentModel;
}

function configureUserMainDatabaseAdapterORM() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.USER_DB_PATH,
    });

    return sequelize;
}

function configureUserModel(container) {
    UserModel.setup(container.get('UsersSequelize'));
    return UserModel;
}

function configureClientsMainDatabaseAdapterORM() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.CLIENT_DB_PATH,
    });

    return sequelize;
} 

function configureClientModel(container) {
    ClientModel.setup(container.get('ClientsSequelize'));
    return ClientModel;
}

function addCommonDefinitions(container) {
    container.addDefinitions({
        Session: factory(configureSession),
        Passport: passport,
        Bcrypt: bcrypt,
        Multer: factory(configureMulter),
        CarsSequelize: factory(configureCarsMainDatabaseAdapterORM),
        RentsSequelize: factory(configureRentMainDatabaseAdapterORM),
        UsersSequelize: factory(configureUserMainDatabaseAdapterORM),
        ClientsSequelize: factory(configureClientsMainDatabaseAdapterORM)
    });
}

function addModuleDefinitions(container) {
    container.addDefinitions({
        RentsController: object(RentsController).construct(
            get('RentService'),
            get('CarsService'),
            get('ClientsService'),
            ),
        RentService: object(RentsService).construct(get('RentRepository')),
        RentRepository: object(RentsRepository).construct(get('RentModel')),
        RentModel: factory(configureRentModel),
    });
}

function addCarsModuleDefinitions(container) {
    container.addDefinitions({
        CarsController: object(CarsController).construct(get('Multer'), get('CarsService')),
        CarsService: object(CarsService).construct(get('CarsRepository')),
        CarsRepository: object(CarsRepository).construct(get('CarModel')),
        CarModel: factory(configureCarModel),
    });
}

function addUsersModuleDefinitions(container) {
    container.addDefinitions({
        UsersController: object(UsersController).construct(get('Passport')),
        UserService: object(UsersService).construct(get('UserRepository')),
        UserRepository: object(UsersRepository).construct(get('UserModel'), get('Bcrypt')),
        UserModel: factory(configureUserModel),
    });
}

function addClientsModuleDefinitions(container) {
    container.addDefinitions({
        ClientsController: object(ClientsController).construct(get('ClientsService')),
        ClientsService: object(ClientsService).construct(get('ClientsRepository')),
        ClientsRepository: object(ClientsRepository).construct(get('ClientModel')),
        ClientModel: factory(configureClientModel),
    })
}

module.exports = function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);
    addModuleDefinitions(container);
    addCarsModuleDefinitions(container);
    addUsersModuleDefinitions(container);
    addClientsModuleDefinitions(container);
    return container;
};
