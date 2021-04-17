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

container.get('CarModel');
container.get('RentModel');

mainCarsDb.sync();
mainRentsDb.sync();
