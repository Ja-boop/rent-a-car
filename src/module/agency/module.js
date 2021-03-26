const AgencyController = require('./controller/controller');
const CarsService = require('./service/carsService');
const RentService = require('./service/rentService');
const UserService = require('./service/userService');
const CarsRepository = require('./repository/sqlite/crudCarSqlite');
const RentRepository = require('./repository/sqlite/rentSqlite');
const UserRepository = require('./repository/sqlite/userSqlite');

function init(app, container) {
    const controller = container.get('AgencyController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    AgencyController,
    CarsService,
    RentService,
    UserService,
    CarsRepository,
    RentRepository,
    UserRepository,
};