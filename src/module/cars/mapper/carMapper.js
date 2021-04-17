const Car = require('../entity/car');

function fromDataToEntity({
    id,
    brand,
    model,
    'image-url': imageUrl,
    'year-manufactured': yearManufactured,
    kms,
    color,
    'air-conditioner': airConditioner,
    passengers,
    transmission,
    cost,
}) {
    return new Car({
        id: Number(id),
        brand,
        model,
        imageUrl,
        yearManufactured,
        kms,
        color,
        airConditioner,
        passengers,
        transmission,
        cost,
    });
}

/**
 * @param {import('../model/carModel')} model
 * @returns {import('../../entity/car')}
 */
function fromModelToEntity(model) {
    
    return new Car(model.toJSON());
}

module.exports = {
    fromDataToEntity,
    fromModelToEntity,
};