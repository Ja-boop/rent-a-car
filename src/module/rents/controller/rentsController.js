const { fromDataToEntity } = require('../mapper/reserveMapper');
const getCurrentDate = require('../service/functions')
const AbstractController = require('./abstractController');
const CarNotDefinedError = require('../../cars/service/error/carNotDefinedError');

const { paths } = require('./paths/paths');
const { resData } = require('../../data/resData');

module.exports = class RentsController extends AbstractController {
    /**
     * @param {import('../service/rentsService')} rentService
     * @param {import('../../cars/service/carsService')} carsService
     * @param {import('../../clients/service/clientsService')} clientsService
     */
    constructor(rentService, carsService, clientsService) {
        super();
        this.rentService = rentService;
        this.carsService = carsService;
        this.clientsService = clientsService
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        function isAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect(paths.login.path);
        };

        // home
        app.get(paths.index.path, this.index.bind(this));

        // rent-a-car
        app.get(paths.list.path, this.list.bind(this));
        app.get(paths.create.path, this.form.bind(this));
        app.post(paths.create.path, this.save.bind(this));

        // client-reserves
        app.get(paths.reserve.client.selector.path, this.client_selector.bind(this));
        app.get(paths.reserve.list.path, this.client_reserves.bind(this));
        app.get(paths.reserve.delete.path, isAuthenticated, this.delete_reserve.bind(this));
        app.get(paths.reserve.update.path, isAuthenticated, this.view_reserve.bind(this));
        app.post(`/agency/reserve/:id/view`, this.update_reserve.bind(this));
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async index(req, res) {
        res.render(paths.index.render, resData)
    }

    async list(req, res) {
        const cars = await this.carsService.getAllCars();
        res.render(paths.list.render, { data: { cars }, resData });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async form(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }
        try {
            let currentDate = getCurrentDate();
            const car = await this.carsService.getCarById(id);
            const clients = await this.clientsService.getAllClients();
            res.render(paths.create.render, { currentDate, data: { car, clients }, resData })
        } catch (e) {
            req.session.errors = [e.message];
            res.redirect(paths.reserve.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save(req, res) {
        try {
            const reserve = fromDataToEntity(req.body);
            const savedReserve = await this.rentService.rentCar(reserve);
            if (reserve.id) {
                console.log(`La reserva N°: ${reserve.id} se actualizó correctamente`);
            } else {
                console.log(`La reserva N°: ${savedReserve.id} fue creada`);
            }
            res.redirect(paths.reserve.list.redirect(reserve.Client.id));
        } catch (e) {
            console.log(e);
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async client_selector(req, res) {
        const client = await this.clientsService.getAllClients();
        console.log(client)
        res.render(paths.reserve.client.selector.render, { data: { client }, resData })
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async client_reserves(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        try {
            const reserve = await this.rentService.getUserReserve(id);     
            res.render(paths.reserve.list.render, { data: { reserve }, resData })
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_reserve(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        try {
            const reserve = await this.rentService.getReserveById(id);
            await this.rentService.deleteReserve(reserve);
            console.log(`La reserva con ID: ${reserve.id} fue eliminada correctamente`)
            res.redirect(paths.reserve.delete.redirect(reserve.Client.id))
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async view_reserve(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error('id undefined');
        }

        try {
            let currentDate = getCurrentDate();
            const reserve = await this.rentService.getReserveById(id);
            res.render(paths.reserve.update.render, { currentDate, data: { reserve }, resData });
        } catch (e) {
            console.log(e);
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_reserve(req, res) {
        try {
            const reserve = fromDataToEntity(req.body);
            await this.rentService.rentCar(reserve);
            console.log(`La reserva N°: ${reserve.id} se actualizó correctamente`);
            res.redirect(paths.reserve.list.redirect(reserve.Client.id));
        } catch (e) {
            console.log(e);
            res.redirect(paths.reserve.client.selector.path);
        }
    }
}

