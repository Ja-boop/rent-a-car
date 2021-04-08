const AgencyController = require('./controller/controller');
const RentService = require('./service/rentService');
const UserService = require('./service/userService');
const RentRepository = require('./repository/sqlite/rentSqlite');
const UserRepository = require('./repository/sqlite/userSqlite');

function init(app, container) {
    const controller = container.get('AgencyController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    AgencyController,
    RentService,
    UserService,
    RentRepository,
    UserRepository,
};