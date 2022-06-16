const bcrypt = require("bcrypt");
const passport = require("passport");
const { GetString } = require("../../Utils/GetValue");
const { CatchErr, SuccessResp, RespCustomCode, CREATE_TRANSPORTER, SALT_ROUND } = require("../../Utils/UtilsFunction");
const { NewLocalUserDAO, LocalLoginDAO } = require("./UsersDAO");
const LocalStratery = require("passport-local").Strategy;

const FILE_NAME = " - UsersController.js";

(function initPassport() {
    passport.use(new LocalStratery({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
    }, function verify(req, username, password, done) {
        console.log("?", username);
        done(null, {uid: 1});
    }));

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.serializeUser((user, done) => {
        done(null, user);
    });
})();

exports.NewLocalUser = async (req, resp) => {
    const FUNC_NAME = "NewLocalUser" + FILE_NAME;
    const reqData   = req.body;
    try {
        const first_name    = GetString(reqData, "first_name");
        const last_name     = GetString(reqData, "last_name");
        const username      = GetString(reqData, "username");
        const mobile        = GetString(reqData, "mobile");
        const email         = GetString(reqData, "email");
        const password      = GetString(reqData, "password");

        const SALT          = bcrypt.genSaltSync(SALT_ROUND);
        const hash_pass     = bcrypt.hashSync(password, SALT);
        const result        = await NewLocalUserDAO(first_name, last_name, username, mobile, email, hash_pass);

        if (result.code === 200) {
            const ET = CREATE_TRANSPORTER();
            ET.sendMail({
                from    : process.env.EMAIL,
                to      : email,
                subject : "XÁC THỰC TÀI KHOẢN",
                html    : `<p>Bạn vừa đăng ký tài khoản tại KMA ALO, vui lòng bấm vào <a>đây</a> để kích hoạt tài khoản</p>`
            });
            SuccessResp(resp, "Kiểm tra email để xác thực tài khoản!");
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.AuthenticateError = async(req, resp) => {
    RespCustomCode(resp, 403, "Điền đủ trường 'username' và 'password'");
}

exports.LocalAuthenticate = async(req, resp) => {
    const FUNC_NAME = "NewLocalUser" + FILE_NAME;
    const reqData   = req.body;
    try {
        const username      = GetString(reqData, "username", false);
        const hash_pass     = GetString(reqData, "password", false);
        const result        = await LocalLoginDAO(username);

        if (result.code === 200) {
            const user_info = result.msg[0];
            if (user_info.EMAIL_CONFIRMED === 0) {
                RespCustomCode(resp, 900, "Vui lòng kiểm tra email để kích hoạt tài khoản!");
            } else {
                const ET = CREATE_TRANSPORTER();
                ET.sendMail({
                    from    : process.env.EMAIL,
                    to      : email,
                    subject : "XÁC THỰC TÀI KHOẢN",
                    html    : `<p>Bạn vừa đăng ký tài khoản tại KMA ALO, vui lòng bấm vào <a>đây</a> để kích hoạt tài khoản</p>`
                });
                SuccessResp(resp, "ok hehe");
            }
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}