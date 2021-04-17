const RentsController = require('./controller/rentsController');
const RentsService = require('./service/rentsService');
const RentsRepository = require('./repository/orm/rentsRepository');
const RentModel = require('./model/rentModel');

function init(app, container) {
    const controller = container.get('RentsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    RentsController,
    RentsService,
    RentsRepository,
    RentModel,
};