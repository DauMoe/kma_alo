const nodemailer    = require("nodemailer");
const PORT          = process.env.SV_PORT || 8080;
const ip            = require("ip");
const IMAGE_PATH    = "assets/image";
const JWT_SECRET_KEY = "kme_alo";
const jwt = require("jsonwebtoken");

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
    try {
        if (!req.headers.authorization) {
            RespCustomCode(resp, undefined, "Vui lòng xác thực để tiếp tục!", 403);
        } else {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader.indexOf("Bearer") === -1) {
                RespCustomCode(resp, undefined, "Token không hợp lệ!", 401);
            } else {
                const token = authorizationHeader.split(" ")[1];
                jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
                    if (err) {
                        console.log("=== Authenticate - UtilsFunction.js ===: ", e);
                        RespCustomCode(resp, undefined, "Token hết hạn hoặc không hợp lệ!", 401);
                    } else {
                        req.app.locals.uid      = decoded.uid;
                        req.app.locals.email    = decoded.email;
                        req.app.locals.username = decoded.username;
                        next();
                    }
                });
            }
        }
    } catch (e) {
        RespCustomCode(resp, undefined, e, 500);
    }
}

exports.HOST_PORT       = PORT;
exports.HOST_ADDRESS    = `${ip.address()}:${PORT}/`;
exports.IMAGE_PATH      = IMAGE_PATH;
exports.SALT_ROUND      = 5;
exports.JWT_SECRET_KEY  = JWT_SECRET_KEY;
