const Reserve = require('../../entity/reserve');

module.exports = function createTestReserve(id) {
    return new Reserve({
        id,
        takeDay: '2021-05-18',
        returnDay: '2021-05-28',
        payment: 'Cash',
        status: 'No',
        finalCost: 60000,
        Car: 1,
        Client: 1
    })
}
