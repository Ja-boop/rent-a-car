const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ROUTE = '/agency';
const { fromDataToEntity } = require('../mapper/carMapper');
const { fromDataToEntityReserve } = require('../mapper/reserveMapper');
const { rentCar, getUserReserve, deleteReserve, getReserveById } = require('../repository/sqlite/rentSqlite');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(`${ROUTE}/login`)
};

function getCurrentDate() {
    let today = new Date();

    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let date = ("0" + today.getDate()).slice(-2);

    return currentDate = `${year}-${month}-${date}`
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, process.env.CARIMAGE_UPLOAD_DIR);
    },
    filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage })

router.get('/', (req, res, next) => {
    res.render('views/home.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});


// user authentication
router.get(`${ROUTE}/signup`, (req, res, next) => {
    res.render('views/signup.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post(`${ROUTE}/signup`, passport.authenticate('local-signup', {
    successRedirect: `${ROUTE}/profile`,
    failureRedirect: `${ROUTE}/signup`,
    passReqToCallback: true
}));

router.get(`${ROUTE}/login`, (req, res, next) => {
    res.render('views/login.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post(`${ROUTE}/login`, passport.authenticate('local-login', {
    successRedirect: '/agency/profile',
    failureRedirect: '/agency/login',
    passReqToCallback: true
}));


// profile
router.get(`${ROUTE}/profile`, isAuthenticated, (req, res, next) => {
    res.render('views/profile.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.get(`${ROUTE}/logout`, (req, res, next) => {
    req.logOut();
    res.redirect('/')
});


// crud-cars
router.get(`${ROUTE}/car/list`, async (req, res) => { // Lista de vehículos
    const car = await getAllCars();
    res.render('views/list.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
});

router.get(`${ROUTE}/create/car`, (req, res) => { // Form para creación de vehículos
    res.render('views/form.njk', { logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
});

router.post(`${ROUTE}/create/car`, upload.single('image_url'), async (req, res) => {
    try {
        const car = fromDataToEntity(req.body);
        if (req.file) {
            const { path } = req.file;
            car.imageUrl = path;
        }
        const savedCar = await saveCar(car);
        if (car.id) {
            req.flash('updateCarMessage', `El vehículo con el ID: ${car.id} se actualizo correctamente`);
        } else {
            req.flash('newCarCreatedMessage', `Se creo el vehículo con ID: ${savedCar.id} (${savedCar.brand}, ${savedCar.model})`);
        }
        res.redirect(`${ROUTE}/car/list`);
    } catch (e) {
        console.log(e);
        req.flash('carCreationErrorMessage', `${e}`);
        res.redirect(`${ROUTE}/car/list`);
    }
});

router.get(`${ROUTE}/delete/car/:id`, async (req, res) => { // Eliminar el vehículo
    try {
        const { id } = req.params;
        const car = await getCarById(id);
        await deleteCar(car);
        req.flash('carDeletedMessage', `El vehículo con ID: ${car.id} (${car.brand}, ${car.model}) fue eliminado correctamente`);
    } catch (e) {
        req.flash('carDeletedErrorMessage', e);
    }
    res.redirect(`${ROUTE}/car/list`)
});

router.get(`${ROUTE}/view/car/:id`, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new Error(`No se encontro el vehículo con el ID: ${id}`)
    }
    try {
        const car = await getCarById(id);
        res.render('views/form.njk', { data: { car } });
    } catch (e) {
        req.flash('viewCarErrorMessage', e);
        res.redirect(`${ROUTE}/car/list`);
    }
});

// rent-a-car
router.get(`${ROUTE}/rent/car/list`, isAuthenticated, async (req, res) => { // list
    const car = await getAllCars();
    res.render('views/rentList.njk', { data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
});

router.get(`${ROUTE}/rent/car/:id`, isAuthenticated, async (req, res) => { // form
    const { id } = req.params;
    if (!id) {
        throw new Error(`No se encontro el vehículo con el ID: ${id}`)
    }
    try {
        let currentDate = getCurrentDate();
        const car = await getCarById(id);
        console.log(car)
        res.render('views/rentCar.njk', { currentDate, data: { car }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
    } catch (e) {
        console.log(e);
        req.flash('rentCarErrorMessage', `${e}`);
        res.redirect(`${ROUTE}/rent/car/list`);
    }
});

router.post(`${ROUTE}/rent/car/:id`, async (req, res) => {
    try {
        const reserve = fromDataToEntityReserve(req.body);
        const savedReserve = await rentCar(reserve);
        if (savedReserve.id) {
            req.flash('updateReserveMessage', `La reserva N°: ${reserve.id} se actualizó correctamente`);
        } else {
            req.flash('newReserveCreatedMessage', `La reserva N°: ${savedReserve.id} fue creada`);
        }
        res.redirect(`${ROUTE}/reserve/list`);
    } catch (e) {
        console.log(e);
        req.flash('reserveCreationErrorMessage', `${e}`);
        res.redirect(`${ROUTE}/car/list`);
    }
});

// user cars
router.get(`${ROUTE}/reserve/list`, isAuthenticated, async (req, res) => {
    try {
        const user = req.user;
        const reserve = await getUserReserve(user.id);
        res.render('views/userCars.njk', { data: { reserve }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
    } catch (e){
        console.log(e);
    }
    
});

router.get(`${ROUTE}/reserve/:id/delete`, isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const reserve = await getReserveById(id);
        await deleteReserve(reserve);
        res.redirect(`${ROUTE}/reserve/list`)
    } catch (e) {
        req.flash('carDeletedErrorMessage', e);
    }
    
});

router.get(`${ROUTE}/reserve/:id/view`, isAuthenticated, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new Error(`No se encontro el vehículo con el ID: ${id}`)
    }
    try {
        const user = req.user;
        let currentDate = getCurrentDate();
        const reserve = await getReserveById(id);
        
        if(reserve.userId === user.id) {
            res.render('views/updateReserve.njk', { currentDate, data: { reserve }, logo: "/public/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" });
        } else {
            res.status(404).send('Esa reserva no esta registrada para este usuario')
        }
    } catch (e) {
        req.flash('viewCarErrorMessage', e);
        res.redirect(`${ROUTE}/car/list`);
    }
});

router.post(`${ROUTE}/reserve/:id/view`, async (req, res) => {
    try {
        const reserve = fromDataToEntityReserve(req.body);
        const savedReserve = await rentCar(reserve);
        if (savedReserve.id) {
            req.flash('updateReserveMessage', `La reserva N°: ${reserve.id} se actualizó correctamente`);
        } else {
            req.flash('newReserveCreatedMessage', `La reserva N°: ${savedReserve.id} fue creada`);
        }
        res.redirect(`${ROUTE}/reserve/list`);
    } catch (e) {
        console.log(e);
        req.flash('reserveCreationErrorMessage', `${e}`);
        res.redirect(`${ROUTE}/car/list`);
    }
});

module.exports = router;
