const CarsController = require('./controller/carsController');
const CarsService = require('./service/carsService');
const CarsRepository = require('./repository/sqlite/crudCarSqlite');

function init(app, container) {
    const controller = container.get('CarsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    CarsService,
    CarsRepository,
};