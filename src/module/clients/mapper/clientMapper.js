const Client = require('../entity/client');

function fromDataToEntity({
    id,
    name,
    'last-name': lastName,
    'identifier-type': identifierType,
    'identifier-number': identifierNumber,
    nationality,
    address,
    phone,
    email,
    birthday,
}) {
    return new Client({
        id: Number(id),
        name,
        lastName,
        identifierType,
        identifierNumber,
        nationality,
        address,
        phone,
        email,
        birthday,
    });
}

/**
 * @param {import('../model/clientModel')} model
 * @returns {import('../../entity/client')}
 */
function fromModelToEntity(model) {
    return new Client(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
};
