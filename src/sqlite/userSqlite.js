const Sqlite3Database = require('better-sqlite3');
const db = new Sqlite3Database(process.env.USER_DB_PATH, { verbose: console.log });
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function saveUser(user) {
    let id;
    const stmt = db.prepare(`
            INSERT INTO user_database(
                email,
                password
            ) VALUES(?, ?)
        `); 

    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    
    const results = stmt.run(
        user.email,
        user.password = hashedPassword
    );

    id = results.lastInsertRowid;
    
    return getUserById(id);
}

async function getUserById(id) {
    const user = db.prepare(
        `SELECT 
        id,
        email,
        password
        FROM user_database WHERE id = ?`
    )
    .get(id);

    if (user===undefined) {
        throw new Error(`No se encontro el usuario con el ID: ${id}`);
    }

    return user;
}

async function getUserByEmail(email) {
    const stmt = db.prepare(
        `SELECT email, password FROM user_database WHERE email = ?`
    )

    const userEmail = stmt.get(email);

    if(userEmail == null || userEmail === undefined) {
        return false;
    }

    return userEmail;
    
}

async function comparePasswords(password, hash) {
    let results = await bcrypt.compare(password, hash);
    return results
}

module.exports = { getUserByEmail, saveUser, comparePasswords };
