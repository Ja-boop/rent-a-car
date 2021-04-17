const CarsController = require('./controller/carsController');
const CarsService = require('./service/carsService');
const CarsRepository = require('./repository/orm/carsRepository');
const CarModel = require('./model/carModel');

function init(app, container) {
    const controller = container.get('CarsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    CarsController,
    CarsService,
    CarsRepository,
    CarModel,
};