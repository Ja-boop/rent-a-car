const abstractRentRepositoryError = require('../error/abstractRepositoryError');

module.exports = class AbstractRentRepository {
    constructor() {
        if (new.target === AbstractRentRepository) {
            throw new abstractRentRepositoryError(
                'No se puede instanciar el repositorio abstracto de la agencia.'
            )
        }
    }

    /**
     * @param {import('../entity/car')} car 
     * @returns {import('../entity/car')}
     */
    async rentCar(reserve) {}

    /**
     * @param {Number} id 
     */
    async deleteReserve(reserve) {}

    /**
     * @param {Number} id 
     * @returns {import('../entity/car')}
     */
    async getUserReserve(id) {}

    /**
     * @returns {Array<import('../entity/car')>}
     */
    async getReserveById() {}

    /**
     * @returns {Array<import('../entity/car')>}
     */
    async changePayStatus() {}
};