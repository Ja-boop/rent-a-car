/**
 * @typedef {import('../repository/sqlite/abstract/abstractUserRepository')} AbstractUserRepository
*/

const User = require('../entity/user');
const UserIdNotDefinedError = require('./error/userIdNotDefinedError');
const UserNotDefinedError = require('./error/userNotDefinedError');
const UserEmailNotDefinedError = require('./error/userEmailNotDefinedError');
const PasswordsParametersError = require('./error/passwordsParametersError');

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
            throw new UserNotDefinedError();
        }
        return this.userRepository.saveUser(user)
    }

    async getUserById(id) {
        if (id === undefined) {
            throw new UserIdNotDefinedError();
        }

        return this.userRepository.getUserById(id);
    }

    async getUserByEmail(email) {
        if (email === undefined) {
            throw new UserEmailNotDefinedError();
        }

        return this.userRepository.getUserByEmail(email);
    }

    async comparePasswords(pass, hash) {
        if (pass === undefined) {
            throw new PasswordsParametersError();
        }

        if (hash === undefined) {
            throw new PasswordsParametersError();
        }

        let results = this.userRepository.comparePasswords(pass, hash);
        return results
    }

}
