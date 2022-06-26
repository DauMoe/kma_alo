const bcrypt = require("bcrypt");
const { GetString, GetNumber } = require("../../Utils/GetValue");
const { CatchErr, SuccessResp, RespCustomCode, CREATE_TRANSPORTER, SALT_ROUND, JWT_SECRET_KEY, HOST_ADDRESS} = require("../../Utils/UtilsFunction");
const { NewLocalUserDAO, LocalLoginDAO, GetUserInfoDAO, ActiveAccountDAO } = require("./UsersDAO");
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
            console.log(`${HOST_ADDRESS}/verify/${result.msg}`);
            // const ET = CREATE_TRANSPORTER();
            // ET.sendMail({
            //     from    : process.env.EMAIL,
            //     to      : email,
            //     subject : "XÁC THỰC TÀI KHOẢN",
            //     html    : `<h1>HALO</h1><p>Click </p><a href="${HOST_ADDRESS}/verify/${result.msg}" target="_blank">here</a><p> to active your account</p><h3>We're very happy when you're a part of our network!</h3><h2 style="color: #B02D2D, text-align: right">~ Be happy <3 ~</h2>`
            // });
            SuccessResp(resp, "Check mail to active account!");
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
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
    }, JWT_SECRET_KEY, { expiresIn: 60 * 60 * 60000 });
    SuccessResp(resp, {
        token   : token,
        username: userInfo.USERNAME    === null ? "" : userInfo.USERNAME,
        avatar  : userInfo.AVATAR_LINK === null ? "" : userInfo.AVATAR_LINK
    });
}

exports.GetUserInfo = async(req, resp) => {
    const FUNC_NAME = "GetUserInfo" + FILE_NAME;
    const uid = req.app.locals.uid;
    try {
        const result    = await GetUserInfoDAO(uid);
        console.log(result);
        if (result.code === 200) {
            const data = result.msg[0];
            const UserData = {
                first_name      : data.FIRST_NAME       === null ? "" : data.FIRST_NAME,
                last_name       : data.LAST_NAME        === null ? "" : data.LAST_NAME,
                username        : data.USERNAME         === null ? "" : data.USERNAME,
                mobile          : data.MOBILE           === null ? "" : data.MOBILE,
                email           : data.EMAIL            === null ? "" : data.EMAIL,
                email_confirmed : data.EMAIL_CONFIRMED  === 1,
                avatar_link     : data.AVATAR_LINK      === null ? "" : data.AVATAR_LINK
            };
            SuccessResp(resp, {user_data: UserData});
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.VerifyAccount = async(req, resp) => {
    try {
        const uuid      = GetString(req.params, "uuid");
        const result    = await ActiveAccountDAO(uuid);
        if (result.code === 200) {
            resp.send(`
                <img style="text-align: center" src="${HOST_ADDRESS}create_account.svg" width="100%" height="100%"/>
            `);
        } else {
            resp.send(`<h3>${result}</h3>`);
        }
    } catch(e) {
        resp.send("<h1>Missing params!</h1>");
    }
}