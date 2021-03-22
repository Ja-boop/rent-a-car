const carsRepositoryAbstractError = require('./error/carsRepositoryAbstractError');

module.exports = class AbstractCarsRepository {
    constructor() {
        if (new.target === AbstractCarsRepository) {
            throw new carsRepositoryAbstractError(
                'No se puede instanciar el repositorio abstracto de la agencia.'
            )
        }
    }

    /**
     * @param {import('../entity/car')} car 
     * @returns {import('../entity/car')}
     */
    async saveCar(car) {}

    /**
     * @param {Number} id 
     */
    async deleteCar(id) {}

    /**
     * @param {Number} id 
     * @returns {import('../entity/car')}
     */
    async getCarById(id) {}

    /**
     * @returns {Array<import('../entity/car')>}
     */
    async getAllCars() {}

    /**
     * @param {Number} id
     * @returns {Array<import('../entity/car')>}
     */
    async getUserCars(id) {}
};