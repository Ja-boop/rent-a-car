const Car = require('../../entity/car');

module.exports = function createTestCar(id) {
    return new Car({
        id,
        brand: 'BMW',
        model: 'M3 GTR',
        imageUrl: '/img/no-image-available.jpg',
        yearManufactured: 2000,
        kms: 150000,
        color: 'Red',
        airConditioner: 'No',
        passengers: 2,
        transmission: 'Manual',
        cost: 60000
    })
};
