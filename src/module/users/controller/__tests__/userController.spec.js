const UserController = require('../userController');
const User = require('../../entity/user');
const paths = require('../paths/paths');
const { resData } = require('../../../data/resData');

const controller = new UserController({});

test('controller.signup renderea signup', async () => {
    const reqMock = { session: { errors: [] }};
    const resMock = { render: jest.fn() };
    await controller.signup(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenLastCalledWith(paths.signup.render, {errors: [], resData});
});

test('controller.login renderea login', async () => {
    const reqMock = { session: { errors: [] }};
    const resMock = { render: jest.fn() };
    await controller.login(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenLastCalledWith(paths.login.render, {errors: [], resData});
});

test('controller.profile renderea profile', async () => {
    const reqMock = {};
    const resMock = { render: jest.fn() };
    await controller.profile(reqMock, resMock);

    expect(resMock.render).toHaveBeenCalledTimes(1);
    expect(resMock.render).toHaveBeenLastCalledWith(paths.profile.render, {resData});
});

test('controller.logout redirecciona a index', async () => {
    const reqMock = { logOut: jest.fn() };
    const resMock = { redirect: jest.fn() };
    await controller.logout(reqMock, resMock);

    expect(resMock.redirect).toHaveBeenCalledTimes(1);
    expect(resMock.redirect).toHaveBeenLastCalledWith(paths.index.path);
});
