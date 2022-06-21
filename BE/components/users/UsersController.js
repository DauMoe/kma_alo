const bcrypt = require("bcrypt");
const { GetString } = require("../../Utils/GetValue");
const { CatchErr, SuccessResp, RespCustomCode, CREATE_TRANSPORTER, SALT_ROUND, JWT_SECRET_KEY} = require("../../Utils/UtilsFunction");
const { NewLocalUserDAO, LocalLoginDAO } = require("./UsersDAO");
const jwt = require("jsonwebtoken");

const FILE_NAME = " - UsersController.js";

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

exports.CheckRequiredLoginField = async(req, resp, next) => {
    const FUNC_NAME = "LocalLogin" + FILE_NAME;
    const reqData   = req.body;
    try {
        GetString(reqData, "username");
        GetString(reqData, "password");
        next();
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.AuthenticateSuccess = async(req, resp) => {
    const userInfo = req.app.locals.user;
    const token = jwt.sign({
        uid     : userInfo.UID,
        email   : userInfo.EMAIL,
        username: userInfo.USERNAME
    }, JWT_SECRET_KEY, { expiresIn: 60 * 60 });
    SuccessResp(resp, {
        token   : token,
        username: userInfo.USERNAME    === null ? "" : userInfo.USERNAME,
        avatar  : userInfo.AVATAR_LINK === null ? "" : userInfo.AVATAR_LINK
    });
}