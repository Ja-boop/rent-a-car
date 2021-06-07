//const bcrypt = require('bcrypt');
//const saltRounds = 10;
const AbstractUserRepository = require('../sqlite/abstract/abstractUserRepository');

module.exports = class UsersRepository extends AbstractUserRepository {
    /**
     * @param {import('better-sqlite3').Database} databaseAdapter 
     */
    constructor (databaseAdapter, hashService) {
        super();
        this.databaseAdapter = databaseAdapter;
        this.hashService = hashService;
        this.saltRounds = 10;
    }

    saveUser(user) {
        let id;
        const stmt = this.databaseAdapter.prepare(`
            INSERT INTO user_database(
                email,
                password
            ) VALUES(?, ?)
        `);

        const hashedPassword = this.hashService.hash(user.password, this.saltRounds);

        const results = stmt.run(
            user.email,
            user.password = hashedPassword
        );

        id = results.lastInsertRowid;

        return this.getUserById(id);
    }

    getUserById(id) {
        const stmt = this.databaseAdapter.prepare(
            `SELECT id, email, password FROM user_database WHERE id = ?`
        )

        const userId = stmt.get(id);

        if (userId == null || userId === undefined) {
            return false;
        }

        return userId;

    }

    getUserByEmail(email) {
        const stmt = this.databaseAdapter.prepare(
            `SELECT id, email, password FROM user_database WHERE email = ?`
        )

        const userEmail = stmt.get(email);

        if (userEmail == null || userEmail === undefined) {
            return false;
        }

        return userEmail;

    }

    async comparePasswords(password, hash) {
        let results = await this.hashService.compare(password, hash);
        return results
    }

}
