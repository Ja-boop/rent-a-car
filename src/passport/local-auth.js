const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { saveUser, getUserByEmail } = require('../sqlite/sqlite')


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
}, async (req, email, password, done) => {
    const user = req.body;
    const userEmail = await getUserByEmail(user.email);
    if(userEmail) {
        done(null, false, 'El correo ya ha sido registrado');
    } else {
        await saveUser(user);
        done(null, user);
    }
    
}));
