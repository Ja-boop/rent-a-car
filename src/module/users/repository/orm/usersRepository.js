const AbstractUserRepository = require('./abstract/abstractUserRepository');
const { fromModelToEntity } = require('../../mapper/userMapper');

module.exports = class UsersRepository extends AbstractUserRepository {
    /**
     * @param {typeof import('../../model/userModel')} userModel
     */
    constructor(userModel, hashService) {
        super();
        this.userModel = userModel;
        this.hashService = hashService;
        this.saltRounds = 10;
    }

    /**
     * @param {typeof import('../../entity/user')} user
     * @returns {Promise<import('../../entity/user')>}
     */
    async saveUser(user) {
        let userModel;

        const hashedPassword = await this.hashService.hash(user.password, this.saltRounds);
        const buildOptions = { isNewRecord: !user.id };
        userModel = this.userModel.build({
            email: user.email,
            password: hashedPassword,
        }, buildOptions);
        userModel = await userModel.save();

        return user;
    }

    /**
     * @param {String} email
     * @returns {Promise<import('../../entity/user')>}
     */
    async getUserByEmail(email) {
        const userModel = await this.userModel.findOne({
            where: { email }
        });

        if (userModel == null || userModel === undefined) {
            return false;
        }

        return fromModelToEntity(userModel);
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/user')>}
     */
     async getUserById(id) {
        const userModel = await this.userModel.findOne({
            where: { id }
        });

        if (userModel == null || userModel === undefined) {
            return false;
        }

        return fromModelToEntity(userModel);
    }

    async comparePasswords(password, hash) {
        let results = await this.hashService.compare(password, hash);
        return results
    }
}
