const passport = require("passport");
const {LocalLoginDAO} = require("../Users/UsersDAO");
const bcrypt = require("bcrypt");
const {RespCustomCode, SuccessResp, CatchErr} = require("../../Utils/UtilsFunction");
const JsonStrategy = require("passport-json").Strategy;

const StrategyName = 'local_json';

passport.use(StrategyName, new JsonStrategy({passReqToCallback: true}, async function(req, username, password, done) {
    const result = await LocalLoginDAO(username);
    if (result.code === 200) {
        const user_info = result.msg[0];
        if (user_info.EMAIL_CONFIRMED === 0) {
            done(null, false, {code: 401, msg: "Confirm email to active account!"});
        } else {
            const match = await bcrypt.compare(password, user_info.PASSWORD);
            if (match) {
                done(null, user_info);
            } else {
                done(null, false, {code: 402, msg: "Password is not match!"});
            }
        }
    } else {
        done(null, false, {code: result.code, msg: result.msg});
    }
}));

passport.deserializeUser((user, done) => {
    console.log("DE: ", user);
    done(null, user);
});

passport.serializeUser((user, done) => {
    console.log("SE: ",user);
    done(null, user);
});

exports.PassportJsonAuthenticate = function(req, resp, next) {
    const FUNC_NAME = "PassportJsonAuthenticate - PassportJsonInit.js";
    const PassportAuthenticate = passport.authenticate(StrategyName, {failureMessage: true}, function(err, user, message) {
        if (err) {
            console.log("case 1");
            CatchErr(resp, err.message, FUNC_NAME);
        } else if (user) {
            console.log("case 2");
            req.app.locals.user = user;
            next();
        } else {
            console.log("case 3");
            RespCustomCode(resp, undefined, message.msg, message.code);
        }
    });
    PassportAuthenticate(req, resp, next);
}
