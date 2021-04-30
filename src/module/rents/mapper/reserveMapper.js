const Reserve = require('../entity/reserve');

function fromDataToEntityReserve({
    id,
    'user-id': userId,
    'car-id': carId,
    'car-image': carImage,
    'take-day': takeDay,
    'return-day': returnDay,
    cost,
}) {
    return new Reserve({
        id: Number(id),
        userId,
        carId,
        carImage,
        takeDay,
        returnDay,
        cost,
    });
}

/**
 * @param {import('../model/rentModel')} model
 * @returns {import('../../entity/rent')}
 */
function fromModelToEntity(model) {
    return new Reserve(model.toJSON());
}

module.exports = {
    fromDataToEntityReserve,
    fromModelToEntity,
};
