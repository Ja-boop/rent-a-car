const { fromDataToEntity } = require('../mapper/carMapper');
const { fromDataToEntityReserve } = require('../mapper/reserveMapper');
const AbstractController = require('../controller/abstractController');

module.exports = class AgencyController extends AbstractController {
    /**
     * @param {import('../service/carsService')} carsService
     */
    constructor(userAuthentication, carsService) {
        super();
        this.ROUTE_BASE = '/agency';
        this.userAuthentication = userAuthentication;
        this.carsService = carsService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;

        app.get(`${ROUTE}/`, this.index.bind(this));

        // user authentication
        app.get(`${ROUTE}/signup`, this.signup.bind(this));
        app.post(`${ROUTE}/signup`, this.userAuthentication.authenticate('local-signup', {
            successRedirect: `${ROUTE}/profile`,
            failureRedirect: `${ROUTE}/signup`,
            passReqToCallback: true
        }));
        app.get(`${ROUTE}/login`, this.login.bind(this));
        app.post(`${ROUTE}/login`, this.userAuthentication.authenticate('local-login', {
            successRedirect: '/agency/profile',
            failureRedirect: '/agency/login',
            passReqToCallback: true
        }));

        // profile
        app.get(`${ROUTE}/profile`, this.profile.bind(this));
        app.get(`${ROUTE}/logout`, this.logout.bind(this));

        // crud-cars
        app.get(`${ROUTE}/car/list`, this.carList.bind(this));


    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async index(req, res) {
        res.render('views/home.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
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

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async carList(req, res) {
    
        const car = await this.carsService.getAllCars();
    
        res.render('views/list.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }
}

