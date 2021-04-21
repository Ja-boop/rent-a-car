const abstractClientsRepositoryError = require('../error/abstractRepositoryError');

module.exports = class AbstractClientsRepository {
    constructor() {
        if (new.target === AbstractClientsRepository) {
            throw new abstractClientsRepositoryError(
                'No se puede instanciar el repositorio abstracto de la agencia.'
            )
        }
    }

    /**
     * @param {import('../entity/car')} car 
     * @returns {import('../entity/car')}
     */
    async saveClient(client) {}

    /**
     * @param {Number} id 
     */
    async deleteClient(id) {}

    /**
     * @param {Number} id 
     * @returns {import('../entity/car')}
     */
    async getClientById(id) {}
};
