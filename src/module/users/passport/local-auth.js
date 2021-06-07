const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const configureDependecyInjection = require('../../../config/di');
const container = configureDependecyInjection();

/**
 * @param {import('../service/userService')} userService
 */
const userService = container.get('UserService');

passport.serializeUser(async (data, done) => {
    const user = await userService.getUserByEmail(data.email);
    console.log(user);
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, password, email, done) => {
    const user = req.body;
    const userEmail = await userService.getUserByEmail(user.email);
    if (userEmail) {
        done(null, false, req.flash('identEmailMessage', 'El email ya ha sido registrado'));
    } else {
        const savedUser = await userService.saveUser(user);
        done(null, savedUser);
    }

}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = req.body;
    const dbUser = await userService.getUserByEmail(user.email)

    if(!dbUser) {
        return done(null, false)
    }
    
    const compareResults = await userService.comparePasswords(user.password, dbUser.password);
    if (compareResults === false) {
        return done(null, false, console.log(new Error('La contraseña no coincide')))
    }

    return done(null, dbUser);
}));
