const Client = require('../../entity/client');

module.exports = function createTestClient(id) {
    return new Client({
        id,
        name: 'Pedro',
        lastName: 'Sanchez',
        identifierType: 'DNI',
        identifierNumber: 40000000,
        nationality: 'Argentina',
        address: 'Calle falsa 123',
        phone: 3764111111,
        email: 'pedrosanchez@gmail.com',
        birthday: '1985-05-18'
    })
};
