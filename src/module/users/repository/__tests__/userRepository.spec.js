/// <reference types="Jest" />

const { Sequelize } = require('sequelize');
const { UserModel } = require('../../module');
const UsersRepository = require('../orm/usersRepository');
const bcrypt = require('bcrypt');
const createUserTest = require('../../controller/__tests__/users.fixture');

const sequelizeInstance = new Sequelize('sqlite::memory');

/**
 * @type UsersRepository
 */
let repository;

beforeEach(async (done) => {
    const user = UserModel.setup(sequelizeInstance);

    repository = new UsersRepository(user, bcrypt, 10);
    await sequelizeInstance.sync({force: true});
    done();
});

test('Llamar a saveUser guarda un usuario', async () => {
    const userWithoutId = createUserTest();
    const newUser = await repository.saveUser(userWithoutId);
    
    expect(newUser.id).toEqual(1);
});

test('Buscar un user por email', async () => {
    const userEmail = 'pedrosanchez@gmail.com'
    const userWithoutId = createUserTest();
    const newUser = await repository.saveUser(userWithoutId);

    const user = await repository.getUserByEmail(userEmail);
    expect(user.email).toEqual(newUser.email);
});

test('Buscar un user con email inexistente da error', async () => {
    const user = await repository.getUserByEmail()

    expect(user).toEqual(false);
});

test('Buscar un user por id', async () => {
    const userWithoutId = createUserTest();
    const newUser = await repository.saveUser(userWithoutId);
    console.log(newUser);
    const user = await repository.getUserById(1);
    expect(user.id).toEqual(newUser.id);
});

test('Buscar un user con id inexistente da error', async () => {
    const user = await repository.getUserById(1);

    expect(user).toEqual(false);
});

test('Comparar dos contraseñas identicas devuelve true', async () => {
    const password = '1234'
    const hashPassword = '$2b$10$hueV/.OGnVpuogXYra/Eb.EZQQ1GbnybuGxlSvcteDP.6AC.FpnkW'

    const results = await repository.comparePasswords(password, hashPassword);
    expect(results).toEqual(true);
});

test('Comparar dos contraseñas diferentes devuelve false', async () => {
    const password = '12344'
    const hashPassword = '$2b$10$hueV/.OGnVpuogXYra/Eb.EZQQ1GbnybuGxlSvcteDP.6AC.FpnkW'

    const results = await repository.comparePasswords(password, hashPassword);
    expect(results).toEqual(false);
});
