const UsersController = require('./controller/userController');
const UsersService = require('./service/userService');
const UsersRepository = require('./repository/sqlite/userRepository');

function init(app, container) {
    const controller = container.get('UsersController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    UsersController,
    UsersService,
    UsersRepository,
};