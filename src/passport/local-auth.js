const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { saveUser, getUserByEmail, comparePasswords } = require('../sqlite/sqlite')


passport.serializeUser((user, done) => {
    done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
   const user = await getUserByEmail(email);
   done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, password, email, done) => {
    const user = req.body;
    const userEmail = await getUserByEmail(user.email);
    if(userEmail) {
        done(null, false, req.flash('identEmailMessage', 'El email ya ha sido registrado'));
    } else {
        await saveUser(user);
        done(null, user);
    }
    
}));

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = req.body;
    const dbUser = await getUserByEmail(user.email)

    const compareResults = await comparePasswords(user.password, dbUser.password);
    if(dbUser === false) {
        return done(null, false, req.flash('userNotDefinedMessage', 'Usuario no encontrado'))
    }  
    if(compareResults === false) {
        return done(null, false, req.flash('passwordMessage', 'La contraseña es incorrecta'))
    }
    
    return done(null, dbUser);   
}));
