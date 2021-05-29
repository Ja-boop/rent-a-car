/**
 * @typedef {import('../repository/sqlite/abstract/abstractRentRepository')} AbstractRentRepository
*/

const Reserve = require('../entity/reserve');
const ReserveNotDefinedError = require('./error/reserveNotDefinedError');
const ReserveIdNotDefinedError = require('./error/reserveIdNotDefinedError');

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
            throw new ReserveNotDefinedError();
        }
        return this.rentRepository.rentCar(reserve)
    }

    async getUserReserve(id) {
        if (id === undefined) {
            throw new ReserveIdNotDefinedError();
        }

        return this.rentRepository.getUserReserve(id);
    }

    async getReserveById(id) {
        if (id === undefined) {
            throw new ReserveIdNotDefinedError();
        }

        return this.rentRepository.getReserveById(id);
    }

    /**
     * @param {Reserve} reserve
     */
    async deleteReserve(reserve) {
        if(!(reserve instanceof Reserve)) {
            throw new ReserveNotDefinedError();
        }

        return this.rentRepository.deleteReserve(reserve);
    }

    async getAllReserves(){
        return this.rentRepository.getAllReserves();
    }

}
