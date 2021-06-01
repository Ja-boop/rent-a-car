const { fromDataToEntity } = require('../mapper/carMapper');
const AbstractController = require('./abstractController');

const { paths } = require('./paths/paths');
const { resData } = require('../../data/resData');

module.exports = class CarsController extends AbstractController {
    /**
     * @param {import('../service/carsService')} carsService
     */
    constructor(uploadMiddleware, carsService) {
        super();
        this.uploadMiddleware = uploadMiddleware;
        this.carsService = carsService;
    }

    /**
     * @param {import('express').Application} app
     */
    configureRoutes(app) {
        /**
         * @type paths
         */
        app.get(paths.list.path, this.car_list.bind(this));
        app.get(paths.create.path, this.car_form.bind(this));
        app.post(paths.create.path, this.uploadMiddleware.single('image-url'), this.save_car.bind(this));
        app.get(paths.delete.path, this.delete_car.bind(this));
        app.get(paths.update.path, this.update_car.bind(this));
    }


    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async car_list(req, res) {
        const car = await this.carsService.getAllCars();
        res.render(paths.list.render, { data: { car }, resData });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async car_form(req, res) {
        res.render(paths.create.render, { resData });
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async save_car(req, res) {
        try {
            const car = fromDataToEntity(req.body);
            console.log(req.body)
            if (req.file) {
                const { path } = req.file;
                car.imageUrl = path;    
            }
            const savedCar = await this.carsService.saveCar(car);
            if (car.id) {
                console.log(`El vehículo con el ID: ${car.id} se actualizo correctamente`);
            } else {
                console.log(`Se creo el vehículo con ID: ${savedCar.id} (${savedCar.brand}, ${savedCar.model})`);
            }
            res.redirect(paths.list.path);
        } catch (e) {
            req.session.errors = [e.message, e.stack];
            res.redirect(paths.list.path);
        }
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async delete_car(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`id undefined`)
        }

        try {
            const car = await this.carsService.getCarById(id);
            await this.carsService.deleteCar(car);
            console.log(`El vehículo con ID: ${car.id} (${car.brand}, ${car.model}) fue eliminado correctamente`);
        } catch (e) {
            console.log(e);
        }
        res.redirect(paths.list.path);
    }

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async update_car(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error(`No se encontro el vehículo con el ID`)
        }
        try {
            const car = await this.carsService.getCarById(id);
            res.render(paths.create.render, { data: { car }, resData });
        } catch (e) {
            console.log(e);
            res.redirect(paths.list.path);
        }
    }
}
