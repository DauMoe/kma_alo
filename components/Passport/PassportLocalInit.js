const LocalStratery = require("passport-local").Strategy;
const passport = require("passport");

passport.use(new LocalStratery({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
}, function verify(req, username, password, done) {
    // console.log("VERIFY: ", username);
    // done(null, {uid: 1});
    done(null, false, req.flash("msg", "err test"));
}));

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.serializeUser((user, done) => {
    done(null, user);
});