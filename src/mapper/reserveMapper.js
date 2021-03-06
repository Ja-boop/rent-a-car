const Reserve = require('../entity/reserve');

function fromDataToEntityReserve({
    id,
    user_email: userEmail,
    car_id: carId,
    take_day: takeDay,
    return_day: returnDay,
    cost,
}) {
    return new Reserve({
        id: Number(id),
        userEmail,
        carId,
        takeDay,
        returnDay,
        cost,
    });
}

module.exports = {
    fromDataToEntityReserve,
};
