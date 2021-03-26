/**
 * @typedef {import('../repository/sqlite/abstract/abstractRentRepository')} AbstractRentRepository
*/

const Reserve = require('../entity/reserve');

module.exports = class RentService {
    /**
     * @param {AbstractRentRepository} rentRepository
     */
     constructor(rentRepository) {
        this.rentRepository = rentRepository
    }

    /**
     * @param {Reserve} reserve
     */
    async rentCar(reserve) {
        if (reserve === undefined) {
            throw new console.error('Reserve is not defined');
        }
        return this.rentRepository.rentCar(reserve)
    }

    async getUserReserve(id) {
        if (id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.rentRepository.getUserReserve(id);
    }

    async getReserveById(id) {
        if (id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.rentRepository.getReserveById(id);
    }

    /**
     * @param {Reserve} reserve
     */
    async deleteReserve(reserve) {
        if(!(reserve instanceof Reserve)) {
            throw new console.error();
        }

        return this.rentRepository.deleteReserve(reserve);
    }

}
