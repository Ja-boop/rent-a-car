/**
 * @typedef {import('../repository/sqlite/abstract/abstractUserRepository')} AbstractUserRepository
*/

const User = require('../entity/user');

module.exports = class UsersService {
    /**
     * @param {AbstractUserRepository} userRepository
     */
     constructor(userRepository) {
        this.userRepository = userRepository
    }

    /**
     * @param {User} user
     */
    async saveUser(user) {
        if (user === undefined) {
            throw new console.error('User is not defined');
        }
        return this.userRepository.saveUser(user)
    }

    async getUserById(id) {
        if (id === undefined) {
            throw new console.error('ID not defined');
        }

        return this.userRepository.getUserById(id);
    }

    async getUserByEmail(email) {
        if (email === undefined) {
            throw new console.error('Email is not defined');
        }

        return this.userRepository.getUserByEmail(email);
    }

    async comparePasswords(pass, hash) {
        let results = this.userRepository.comparePasswords(pass, hash);
        return results
    }

}
