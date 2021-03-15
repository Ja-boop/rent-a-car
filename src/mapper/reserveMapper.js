const Reserve = require('../entity/reserve');

function fromDataToEntityReserve({
    id,
    user_id: userId,
    car_id: carId,
    car_image: carImage,
    take_day: takeDay,
    return_day: returnDay,
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

module.exports = {
    fromDataToEntityReserve,
};
