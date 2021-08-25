const AbstractController = require('./abstractController');

const paths = require('./paths/paths');
const { resData } = require('../../data/resData');

module.exports = class UsersController extends AbstractController {
    constructor(authStrategy) {
        super();
        this.authStrategy = authStrategy;
    }

    /**
     * @param {import('express').Application} app
     */
    async configureRoutes(app) {
        app.get(paths.signup.path, this.signup.bind(this));
        app.post(paths.signup.path, this.authStrategy.authenticate('local-signup', 
        { failureRedirect: paths.signup.path}), (req, res) => {
            let { current_url } = req.session;
            res.redirect(current_url || paths.index.path);
        }),
        app.get(paths.login.path, this.login.bind(this));
        app.post(paths.login.path, this.authStrategy.authenticate('local-login', 
        { failureRedirect: paths.login.path}), (req, res) => {
            let { current_url } = req.session;
            res.redirect(current_url || paths.index.path);
        }),
     
        app.get(paths.profile.path, this.profile.bind(this));
        app.get(paths.logout.path, this.logout.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async signup(req, res) {
        const { errors } = req.session;
        res.render(paths.signup.render, {resData, errors});
        req.session.errors = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async login(req, res) {
        const { errors } = req.session;
        res.render(paths.login.render, {resData, errors});
        req.session.errors = [];
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async profile(req, res) {
        res.render(paths.profile.render, {resData})
    };

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async logout(req, res) {
        req.logOut();
        res.redirect(paths.index.path);
    };
}
