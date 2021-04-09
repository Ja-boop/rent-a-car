const RentsController = require('./controller/rentsController');
const RentService = require('./service/rentsService');
const RentsRepository = require('./repository/sqlite/rentsRepository');

function init(app, container) {
    const controller = container.get('RentsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    RentsController,
    RentService,
    RentsRepository,
};