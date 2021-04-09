const AgencyController = require('./controller/controller');
const RentService = require('./service/rentService');
const RentRepository = require('./repository/sqlite/rentSqlite');

function init(app, container) {
    const controller = container.get('AgencyController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    AgencyController,
    RentService,
    RentRepository,
};