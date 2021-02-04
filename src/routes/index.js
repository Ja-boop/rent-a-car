const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('home.njk', { logo: "/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

// user authentication
router.get('/signup', (req, res, next) => {

});

router.post('/signup', (req, res, next) => {
    
});

router.get('/login', (req, res, next) => {

});

router.post('/login', (req, res, next) => {
    
});
// user authentication

// rent a car

module.exports = router;
