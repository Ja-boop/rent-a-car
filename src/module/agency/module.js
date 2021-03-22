const AgencyController = require('./controller/controller');
const CarsRepository = require('./repository/sqlite/crudCarSqlite');
const CarsService = require('../agency/service/carsService');

function init(app, container) {
    const controller = container.get('AgencyController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    AgencyController,
    CarsRepository,
    CarsService,
};