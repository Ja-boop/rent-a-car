const Sqlite3Database = require('better-sqlite3');
const db = new Sqlite3Database(process.env.USER_DB_PATH, { verbose: console.log });
const { getCarById } = require('../sqlite/crudCarSqlite');
const { getUserById } = require('../sqlite/userSqlite');

async function rentCar (carId, userId) {

};
