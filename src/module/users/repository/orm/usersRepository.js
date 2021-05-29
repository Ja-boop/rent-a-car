const AbstractUserRepository = require('./abstract/abstractUserRepository');
const { fromModelToEntity } = require('../../mapper/userMapper');
const UserNotFoundError = require('./error/userNotFoundError');

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

        return fromModelToEntity(userModel) ;
    }

    /**
     * @param {String} email
     * @returns {Promise<import('../../entity/user')>}
     */
    async getUserByEmail(email) {
        try {
            const userModel = await this.userModel.findOne({
                where: { email }
            });

            return fromModelToEntity(userModel);
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    /**
     * @param {Number} id
     * @returns {Promise<import('../../entity/user')>}
     */
     async getUserById(id) {
        try {
            const userModel = await this.userModel.findOne({
                where: { id }
            });

            return fromModelToEntity(userModel);
        } catch(e) {
            console.log(e);
            return false
        }        
    }

    async comparePasswords(password, hash) {
        let results = await this.hashService.compare(password, hash);
        return results
    }
}
