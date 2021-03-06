const Car = require('../entity/car');

function fromDataToEntity({
    id,
    brand,
    model,
    image_url: imageUrl,
    year_manufactured: yearManufactured,
    kms,
    color,
    air_conditioner: airConditioner,
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

module.exports = {
    fromDataToEntity,
};