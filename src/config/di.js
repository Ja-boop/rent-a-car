const path = require('path');
const { default: DIContainer, object, get, factory } = require('rsdi');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const Sqlite3Database = require('better-sqlite3');
const { RentsRepository, RentsService, RentsController } = require('../module/rents/module');   
const { CarsRepository, CarsService, CarsController } = require('../module/cars/module');
const { UsersRepository, UsersService, UsersController } = require('../module/users/module');

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

function configureCarsMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.CAR_DB_PATH, {
        verbose: console.log,
    });
}

function configureRentMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.RESERVE_DB_PATH, {
        verbose: console.log,
    });
}

function configureUserMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.USER_DB_PATH, {
        verbose: console.log,
    });
}

function addCommonDefinitions(container) {
    container.addDefinitions({
        Session: factory(configureSession),
        Passport: passport,
        Bcrypt: bcrypt,
        Multer: factory(configureMulter),
        CarsMainDatabaseAdapter: factory(configureCarsMainDatabaseAdapter),
        RentMainDatabaseAdapter: factory(configureRentMainDatabaseAdapter),
        UserMainDatabaseAdapter: factory(configureUserMainDatabaseAdapter),
    });
}

function addModuleDefinitions(container) {
    container.addDefinitions({
        RentsController: object(RentsController).construct(
            get('RentService'),
            get('CarsService'),
            ),
        RentService: object(RentsService).construct(get('RentRepository')),
        RentRepository: object(RentsRepository).construct(get('RentMainDatabaseAdapter')),
    });
}

function addCarsModuleDefinitions(container) {
    container.addDefinitions({
        CarsController: object(CarsController).construct(get('Multer'), get('CarsService')),
        CarsService: object(CarsService).construct(get('CarsRepository')),
        CarsRepository: object(CarsRepository).construct(get('CarsMainDatabaseAdapter')),
    });
}

function addUsersModuleDefinitions(container) {
    container.addDefinitions({
        UsersController: object(UsersController).construct(get('Passport')),
        UserService: object(UsersService).construct(get('UserRepository')),
        UserRepository: object(UsersRepository).construct(get('UserMainDatabaseAdapter'), get('Bcrypt')),
    });
}

module.exports = function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);
    addModuleDefinitions(container);
    addCarsModuleDefinitions(container);
    addUsersModuleDefinitions(container);
    return container;
};
