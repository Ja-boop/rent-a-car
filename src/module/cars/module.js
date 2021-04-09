const CarsController = require('./controller/carsController');
const CarsService = require('./service/carsService');
const CarsRepository = require('./repository/sqlite/carsRepository');

function init(app, container) {
    const controller = container.get('CarsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    CarsController,
    CarsService,
    CarsRepository,
};