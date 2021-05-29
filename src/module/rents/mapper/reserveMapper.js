const Reserve = require('../entity/reserve');
const Client = require('../../clients/entity/client');
const Car = require('../../Cars/entity/car');

function fromDataToEntity({
    id,
    'take-day': takeDay,
    'return-day': returnDay,
    'final-cost': finalCost,
    payment,
    status,
    car_id,
    client_id,
}) {
    return new Reserve({
        id: Number(id),
        takeDay,
        returnDay,
        finalCost,
        payment,
        status,
        Car: new Car({ id: Number(car_id) }),
        Client: new Client({ id: Number(client_id) }),
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
    fromDataToEntity,
    fromModelToEntity,
};
