const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

function cryptPassword(password) {
    bcrypt.hash(password, saltRounds, function(err, hash) {

    });
}

router.get('/', (req, res, next) => {
    res.render('home.njk', { logo: "/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

// user authentication
router.get('/agency/signup', (req, res, next) => {
    res.render('signup.njk', { logo: "/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post('/agency/signup', passport.authenticate('local-signup', {
    successRedirect: '/agency/profile',
    failureRedirect: '/agency/signup',
    passReqToCallback: true
}));

router.get('/agency/login', (req, res, next) => {
    res.render('login.njk', { logo: "/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
});

router.post('/agency/login', passport.authenticate('local-login', {
    successRedirect: '/agency/profile',
    failureRedirect: '/agency/login',
    passReqToCallback: true
}));
// user authentication
// profile
router.get('/agency/profile', (req, res, next) => {
    res.render('profile.njk', { logo: "/logo/logo-luzny.png", github: "https://github.com/Ja-boop/crud-autos" })
})
// profile

// rent a car

module.exports = router;
