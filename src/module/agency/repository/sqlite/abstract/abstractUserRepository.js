const abstractUserRepositoryError = require('../error/abstractRepositoryError');

module.exports = class AbstractUserRepository {
    constructor() {
        if (new.target === abstractUserRepositoryError) {
            throw new abstractRentRepositoryError(
                'No se puede instanciar el repositorio abstracto de la agencia.'
            )
        }
    }

    /**
     * @param {import(''../../../entity/user'')} user 
     * @returns {import(''../../../entity/user'')}
     */
    async saveUser(user) {}

    /**
     * @param {Number} id 
     */
    async getUserById(id) {}

    /**
     * @param {Text} email 
     * @returns {import('../../../entity/user')}
     */
    async getUserByEmail(email) {}

    async comparePasswords(pass, hash) {}
};