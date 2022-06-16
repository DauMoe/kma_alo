const nodemailer    = require("nodemailer");
const PORT          = process.env.SV_PORT || 8080;
const ip            = require("ip");
const IMAGE_PATH    = "assets/image";

const RespCustomCode = (resp, code, data) => {
    resp.statusCode = 200;
    resp.json({
        "code": code,
        "msg": data
    });
}

const CatchErr = (resp, e, func_name) => {
    console.log(`======================== ${func_name} ==========================`);
    if (!!e.message) {
        RespCustomCode(resp, 900, e.message);
    } else if (!!e.sqlMessage) {
        RespCustomCode(resp, 900, e.sqlMessage);
    }
}

const DB_RESP = (code, data) => {
    return {
        "code": code,
        "msg": data
    }
}

exports.DB_ERR = (function_name, sql_bind, e) => {
    console.log(`========== ${function_name}: ${sql_bind}\n${e}`);
}

exports.DB_RESP         = DB_RESP;
exports.RespCustomCode  = RespCustomCode;
exports.CatchErr        = CatchErr;

exports.SuccessResp = (resp, data) => {
    if (data === undefined) {
        RespCustomCode(resp, 200, "Thành công");
    } else {
        RespCustomCode(resp, 200, data);
    }
}

exports.CREATE_TRANSPORTER = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
}

exports.Authenticate = async (req, resp, next) => {
    if (req.isAuthenticated()) next();
    else RespCustomCode(resp, 403, "Vui lòng đăng nhập!");
    // try {
    //    if (!req.headers.authorization) {
    //     resp.json({
    //         code: 403,
    //         msg: "No credentials sent!"
    //     });
    //    } else {
    //     console.log(req.headers.authorization, "Token");
    //     next();
    //    }
    // } catch (e) {
    //     CatchErr(resp, e, "CheckSessionID - UtilsFunction.js")
    // }
}

exports.HOST_PORT       = PORT;
exports.HOST_ADDRESS    = `${ip.address()}:${PORT}/`;
exports.IMAGE_PATH      = IMAGE_PATH;
exports.SALT_ROUND      = 5;
