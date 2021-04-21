const ClientsController = require('./controller/clientsController');
const ClientsService = require('./service/clientsService');
const ClientsRepository = require('./repository/orm/clientsRepository');
const ClientModel = require('./model/clientModel');

function init(app, container) {
    const controller = container.get('RentsController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    ClientsController,
    ClientsService,
    ClientsRepository,
    ClientModel,
};