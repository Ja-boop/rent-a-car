const UsersController = require('./controller/userController');
const UsersService = require('./service/userService');
const UsersRepository = require('./repository/orm/usersRepository');
const UserModel = require('./model/userModel');

function init(app, container) {
    const controller = container.get('UsersController');
    controller.configureRoutes(app);
}

module.exports = {
    init,
    UsersController,
    UsersService,
    UsersRepository,
    UserModel,
};