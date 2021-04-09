const AbstractController = require('./abstractController');

module.exports = class UsersController extends AbstractController {
    /**
     * @param {import('../service/rentService')} rentService
     * @param {import('../../cars/service/carsService')} carsService
     */
    constructor(authStrategy) {
        super();
        this.ROUTE_BASE = '/agency';
        this.authStrategy = authStrategy;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;

        app.get(`${ROUTE}/signup`, this.signup.bind(this));
        app.post(`${ROUTE}/signup`, this.authStrategy.authenticate('local-signup', {
            successRedirect: `${ROUTE}/profile`,
            failureRedirect: `${ROUTE}/signup`,
            passReqToCallback: true
        }));
        app.get(`${ROUTE}/login`, this.login.bind(this));
        app.post(`${ROUTE}/login`, this.authStrategy.authenticate('local-login', {
            successRedirect: '/agency/profile',
            failureRedirect: '/agency/login',
            passReqToCallback: true
        }));
        app.get(`${ROUTE}/profile`, this.profile.bind(this));
        app.get(`${ROUTE}/logout`, this.logout.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async signup(req, res) {
        res.render('views/signup.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async login(req, res) {
        res.render('views/login.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async profile(req, res) {
        res.render('views/profile.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
    };

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async logout(req, res) {
        req.logOut();
        res.redirect('/')
    };
}
