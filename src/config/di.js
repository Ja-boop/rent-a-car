const path = require('path');
const { default: DIContainer, object, get, factory } = require('rsdi');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const Sqlite3Database = require('better-sqlite3');
const { CarsRepository, CarsService, AgencyController } = require('../module/agency/module');   

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

function configureCarsMainDatabaseAdapter() {
    return new Sqlite3Database(process.env.CAR_DB_PATH, {
        verbose: console.log,
    });
}

function addCommonDefinitions(container) {
    container.addDefinitions({
        Session: factory(configureSession),
        Passport: passport,
        CarsMainDatabaseAdapter: factory(configureCarsMainDatabaseAdapter),
    });
}

function addModuleDefinitions(container) {
    container.addDefinitions({
        AgencyController: object(AgencyController).construct(get('Passport', 'CarsService')),
        CarsService: object(CarsService).construct(get('CarsRepository')),
        CarsRepository: object(CarsRepository).construct(get('CarsMainDatabaseAdapter'))
    });
}

module.exports = function configureDI() {
    const container = new DIContainer();
    addCommonDefinitions(container);
    addModuleDefinitions(container);
    return container;
};
