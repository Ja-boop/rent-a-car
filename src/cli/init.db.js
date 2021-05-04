require('dotenv').config();
const express = require('express');
const configureDI = require('../config/di');

const app = express();
const container = configureDI(app);

/**
 * @type {import('sequelize').Sequelize} mainCarsDb
 */
const mainDb = container.get('Sequelize');


container.get('CarModel');
container.get('RentModel');
container.get('UserModel');
container.get('ClientModel');

mainDb.sync();
