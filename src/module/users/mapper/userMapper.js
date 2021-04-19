const User = require('../entity/user');

/**
 * @param {import('../model/userModel')} model
 * @returns {import('../../entity/user')}
 */
function fromModelToEntity(model) {
    return new User(model.toJSON());
}

module.exports = {
    fromModelToEntity,
}
