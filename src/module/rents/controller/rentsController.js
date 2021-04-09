const { fromDataToEntityReserve } = require('../mapper/reserveMapper');
const getCurrentDate = require('../service/functions')
const AbstractController = require('./abstractController');

module.exports = class RentsController extends AbstractController {
    /**
     * @param {import('../service/rentsService')} rentService
     * @param {import('../../cars/service/carsService')} carsService
     */
    constructor(rentService, carsService) {
        super();
        this.ROUTE_BASE = '/agency';
        this.rentService = rentService;
        this.carsService = carsService;
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

