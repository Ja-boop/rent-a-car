require('dotenv').config();
const express = require('express');
const configureDI = require('../config/di');

const app = express();
const container = configureDI(app);

/**
 * @type {import('sequelize').Sequelize} mainCarsDb
 */
const mainCarsDb = container.get('CarsSequelize');
const mainRentsDb = container.get('RentsSequelize');
const mainUsersDb = container.get('UsersSequelize');
const mainClientsDb = container.get('ClientsSequelize');

container.get('CarModel');
container.get('RentModel');
container.get('UserModel');
container.get('ClientModel');

mainCarsDb.sync();
mainRentsDb.sync();
mainUsersDb.sync();
mainClientsDb.sync();

