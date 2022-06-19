const nodemailer    = require("nodemailer");
const PORT          = process.env.SV_PORT || 8080;
const ip            = require("ip");
const IMAGE_PATH    = "assets/image";

const RespCustomCode = (resp, data, description, code) => {
    resp.statusCode = code || 200;
    resp.json({
        "data": data,
        "description": description
    });
}

const CatchErr = (resp, e, func_name) => {
    console.log(`======================== ${func_name} ==========================`);
    if (!!e.message) {
        RespCustomCode(resp, undefined, e.message, 501);
    } else if (!!e.sqlMessage) {
        RespCustomCode(resp, undefined, e.sqlMessage, 501);
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

exports.SuccessResp = (resp, data, description = "Thành công") => {
    RespCustomCode(resp, data, description, 200);
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
    else RespCustomCode(resp, undefined, "Vui lòng đăng nhập!", 401);
}

exports.HOST_PORT       = PORT;
exports.HOST_ADDRESS    = `${ip.address()}:${PORT}/`;
exports.IMAGE_PATH      = IMAGE_PATH;
exports.SALT_ROUND      = 5;
