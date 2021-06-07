const User = require("../../entity/user");

module.exports = function createTestUser(id) {
    return new User ({
        id,
        email: 'pedrosanchez@gmail.com',
        password: '1234',
    })
};