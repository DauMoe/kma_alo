const passport = require("passport");
const {LocalLoginDAO} = require("../users/UsersDAO");
const bcrypt = require("bcrypt");
const {RespCustomCode, SuccessResp} = require("../../Utils/UtilsFunction");
const JsonStrategy = require("passport-json").Strategy;

const StrategyName = 'local_json';

passport.use(StrategyName, new JsonStrategy({passReqToCallback: true}, async function(req, username, password, done) {
    const result = await LocalLoginDAO(username);
    if (result.code === 200) {
        const user_info = result.msg[0];
        if (user_info.EMAIL_CONFIRMED === 0) {
            done(null, false, {code: 401, msg: "Vui lòng kiểm tra mail để kích hoạt tài khoản!"});
        } else {
            const match = await bcrypt.compare(password, user_info.PASSWORD);
            if (match) {
                done(null, user_info);
            } else {
                done(null, false, {code: 401, msg: "Sai mật khẩu!"});
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
    const PassportAuthenticate = passport.authenticate(StrategyName, {failureMessage: true}, function(err, user, message) {
        if (err) {
            RespCustomCode(resp, undefined, err.message, 500);
        } else if (user) {
            req.app.locals.user = user;
            next();
        } else {
            RespCustomCode(resp, undefined, message.msg, message.code);
        }
    });
    PassportAuthenticate(req, resp, next);
}
