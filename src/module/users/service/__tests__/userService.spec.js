/// <reference types="Jest" />

const UserService = require('../userService');
const UserNotDefinedError = require('../error/userNotDefinedError');
const UserIdNotDefinedError = require('../error/userIdNotDefinedError');
const UserEmailNotDefinedError = require('../error/userEmailNotDefinedError');
const PasswordsParametersError = require('../error/passwordsParametersError');

const repositoryMock = {
    saveUser: jest.fn(),
    comparePasswords: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
}

const userService = new UserService(repositoryMock);

test('Guardar un usuario llama al metodo saveUser 1 vez', () => {
    userService.saveUser({});
    expect(repositoryMock.saveUser).toHaveBeenCalledTimes(1);
});

test('LLamar a guardar un usuario sin pasar un parametro da un error especifico', async () => {
    await expect(userService.saveUser).rejects.toThrow(UserNotDefinedError);
});

test('Consultar por un usuario llama al metodo getUserById 1 vez', () => {
    userService.getUserById(1);
    expect(repositoryMock.getUserById).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un usuario sin pasar un ID da un error especifico', () => {
    expect(userService.getUserById).rejects.toThrow(UserIdNotDefinedError);
});

test('Consultar por un usuario llama al metodo getUserByEmail 1 vez', () => {
    let email = 'pedro@gmail.com';
    userService.getUserByEmail(email);
    expect(repositoryMock.getUserByEmail).toHaveBeenCalledTimes(1);
});

test('Llamar a consultar un usuario sin pasar un Email da un error especifico', () => {
    expect(userService.getUserByEmail).rejects.toThrow(UserEmailNotDefinedError);
});

test('Llamar a comparar contraseñas llama a comparePassword 1 vez', async () => {
    let password = '1234';
    let hash = '$2b$10$2.XohDnGqH910goridKxLe2Z4yFzJsyQnNqNofBrmVya3o7p8fYdy';
    userService.comparePasswords(password, hash);
    expect(repositoryMock.comparePasswords).toHaveBeenCalledTimes(1);
});

test('Llamar a comparePassword sin un password da un error especifico', async () => {
    expect(userService.comparePasswords).rejects.toThrow(PasswordsParametersError);
});
