const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { saveUser, getUserByEmail, getUserById, comparePasswords } = require('../sqlite/userSqlite')


passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
   const user = await getUserById(id);
   done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, password, email, done) => {
    const user = req.body;
    console.log(user);
    const userEmail = await getUserByEmail(user.email);
    if(userEmail) {
        done(null, false, req.flash('identEmailMessage', 'El email ya ha sido registrado'));
    } else {
        const savedUser = await saveUser(user);
        done(null, savedUser);
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