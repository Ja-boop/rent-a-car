const { fromDataToEntity } = require('../mapper/carMapper');
const { fromDataToEntityReserve } = require('../mapper/reserveMapper');
const getCurrentDate = require('../service/functions')
const AbstractController = require('../controller/abstractController');

module.exports = class AgencyController extends AbstractController {
    /**
     * @param {import('../service/carsService')} carsService
     * @param {import('../service/rentService')} rentService
     * @param {import('../service/userService')} userService
     */
    constructor(authStrategy, uploadMiddleware, carsService, rentService, userService) {
        super();
        this.ROUTE_BASE = '/agency';
        this.authStrategy = authStrategy;
        this.uploadMiddleware = uploadMiddleware;
        this.carsService = carsService;
        this.rentService = rentService;
        this.userService = userService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE;
        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect(`${ROUTE}/login`)
        };


        // home
        app.get(`${ROUTE}/`, this.index.bind(this));

        // user authentication
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

        // profile
        app.get(`${ROUTE}/profile`, this.profile.bind(this));
        app.get(`${ROUTE}/logout`, this.logout.bind(this));

        // crud-cars
        app.get(`${ROUTE}/car/list`, this.car_list.bind(this));
        app.get(`${ROUTE}/create/car`, this.car_form.bind(this));
        app.post(`${ROUTE}/create/car`, this.uploadMiddleware.single('image_url'), this.save_car.bind(this));
        app.get(`${ROUTE}/delete/car/:id`, this.delete_car.bind(this));
        app.get(`${ROUTE}/view/car/:id`, this.update_car.bind(this));

        // rent-a-car
        app.get(`${ROUTE}/rent/car/list`, isAuthenticated, this.rent_car_list.bind(this));
        app.get(`${ROUTE}/rent/car/:id`, isAuthenticated, this.rent_form.bind(this));
        app.post(`${ROUTE}/rent/car/:id`, this.save_rent.bind(this));

        // user-reserves
        app.get(`${ROUTE}/reserve/list`, isAuthenticated, this.user_reserves.bind(this));
        app.get(`${ROUTE}/reserve/:id/delete`, isAuthenticated, this.delete_reserve.bind(this));
        app.get(`${ROUTE}/reserve/:id/view`, isAuthenticated, this.view_reserve.bind(this));
        app.post(`${ROUTE}/reserve/:id/view`, this.update_reserve.bind(this));
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
    async car_list(req, res) {

        const car = await this.carsService.getAllCars();

        res.render('views/list.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async car_form(req, res) {
        res.render('views/form.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save_car(req, res) {
        try {
            const car = fromDataToEntity(req.body);
            if (req.file) {
                const { path } = req.file;
                car.imageUrl = path;
            }
            const savedCar = await this.carsService.saveCar(car);
            if (car.id) {
                req.flash('updateCarMessage', `El vehículo con el ID: ${car.id} se actualizo correctamente`);
            } else {
                req.flash('newCarCreatedMessage', `Se creo el vehículo con ID: ${savedCar.id} (${savedCar.brand}, ${savedCar.model})`);
            }
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        } catch (e) {
            console.log(e);
            req.flash('carCreationErrorMessage', `${e}`);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_car(req, res) {
        try {
            const { id } = req.params;
            const car = await this.carsService.getCarById(id);
            await this.carsService.deleteCar(car);
            req.flash('carDeletedMessage', `El vehículo con ID: ${car.id} (${car.brand}, ${car.model}) fue eliminado correctamente`);
        } catch (e) {
            req.flash('carDeletedErrorMessage', e);
        }
        res.redirect(`${this.ROUTE_BASE}/car/list`)
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_car(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`No se encontro el vehículo con el ID: ${id}`)
        }
        try {
            const car = await this.carsService.getCarById(id);
            res.render('views/form.njk', { data: { car } });
        } catch (e) {
            req.flash('viewCarErrorMessage', e);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async rent_car_list(req, res) {
        const car = await this.carsService.getAllCars();
        res.render('views/rentList.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async rent_form(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`No se encontro el vehículo con el ID: ${id}`)
        }
        try {
            let currentDate = getCurrentDate();
            const car = await this.carsService.getCarById(id);
            res.render('views/rentCar.njk', { currentDate, data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
        } catch (e) {
            console.log(e);
            req.flash('rentCarErrorMessage', `${e}`);
            res.redirect(`${this.ROUTE_BASE}/rent/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save_rent(req, res) {
        try {
            const reserve = fromDataToEntityReserve(req.body);
            const savedReserve = await this.rentService.rentCar(reserve);
            if (savedReserve.id) {
                req.flash('updateReserveMessage', `La reserva N°: ${reserve.id} se actualizó correctamente`);
            } else {
                req.flash('newReserveCreatedMessage', `La reserva N°: ${savedReserve.id} fue creada`);
            }
            res.redirect(`${this.ROUTE_BASE}/reserve/list`);
        } catch (e) {
            console.log(e);
            req.flash('reserveCreationErrorMessage', `${e}`);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async user_reserves(req, res) {
        try {
            const user = req.user;
            const reserve = await this.rentService.getUserReserve(user.id);
            res.render('views/userCars.njk', { data: { reserve }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_reserve(req, res) {
        try {
            const { id } = req.params;
            const reserve = await this.rentService.getReserveById(id);
            await this.rentService.deleteReserve(reserve);
            res.redirect(`${this.ROUTE_BASE}/reserve/list`)
        } catch (e) {
            req.flash('carDeletedErrorMessage', e);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async view_reserve(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`No se encontro el vehículo con el ID: ${id}`)
        }
        try {
            const user = req.user;
            let currentDate = getCurrentDate();
            const reserve = await this.rentService.getReserveById(id);

            if (reserve.userId === user.id) {
                res.render('views/updateReserve.njk', { currentDate, data: { reserve }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
            } else {
                res.status(404).send('Esa reserva no esta registrada para este usuario')
            }
        } catch (e) {
            req.flash('viewCarErrorMessage', e);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_reserve(req, res) {
        try {
            const reserve = fromDataToEntityReserve(req.body);
            const savedReserve = await this.rentService.rentCar(reserve);
            if (savedReserve.id) {
                req.flash('updateReserveMessage', `La reserva N°: ${reserve.id} se actualizó correctamente`);
            } else {
                req.flash('newReserveCreatedMessage', `La reserva N°: ${savedReserve.id} fue creada`);
            }
            res.redirect(`${this.ROUTE_BASE}/reserve/list`);
        } catch (e) {
            console.log(e);
            req.flash('reserveCreationErrorMessage', `${e}`);
            res.redirect(`${this.ROUTE_BASE}/car/list`);
        }
    }    
}

