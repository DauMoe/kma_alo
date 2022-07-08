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
    console.log(`==== ${func_name}: ${e}`);
    if (!!e.message) {
        RespCustomCode(resp, undefined, e.message, 501);
    } else if (!!e.sqlMessage) {
        RespCustomCode(resp, undefined, e.sqlMessage, 501);
    } else {
        RespCustomCode(resp, undefined, e, 501);
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

exports.SuccessResp = (resp, data, description = "Success") => {
    RespCustomCode(resp, data, description, 200);
}

exports.CREATE_TRANSPORTER = () => {
    console.log(process.env.EMAIL, process.env.PASSWORD);
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
            RespCustomCode(resp, undefined, "Login required!", 401);
        } else {
            const authorizationHeader = req.headers.authorization;
            if (authorizationHeader.indexOf("Bearer") === -1) {
                RespCustomCode(resp, undefined, "Token format invalid!", 401);
            } else {
                const token = authorizationHeader.split(" ")[1];
                jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
                    if (err) {
                        console.log("=== Authenticate - UtilsFunction.js ===: ", err.message);
                        RespCustomCode(resp, undefined, "Token invalid!", 401);
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
        RespCustomCode(resp, undefined, e.message, 500);
    }
}

exports.SocketAuthenticate = function(socket, next) {
    const authoHeader = socket.handshake.headers;
    if (authoHeader.token && authoHeader.token.indexOf("Bearer") > -1) {        
        const token = authoHeader.token.split(" ")[1];
        jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
            if (err) {
                console.log("=== SocketAuthenticate - UtilsFunction.js ===: ", err.message);
                next(new Error("Token invalid!"));
            } else {
                socket.senderInfo = decoded;
                next();
            }
        });
    } else {
        next(new Error("Invalid token"));
    }
};

exports.HOST_PORT       = PORT;
exports.HOST_ADDRESS    = `http:\/\/${ip.address()}:${PORT}/`;
exports.IMAGE_PATH      = IMAGE_PATH;
exports.SALT_ROUND      = 5;
exports.JWT_SECRET_KEY  = JWT_SECRET_KEY;
exports.ChatEventKey    = {
    SENDED  : "SENDED",
    RECEIVED: "RECEIVED",
    READED  : "READED",
    CONN    : 'connect',
    CONN_ERR: 'connect_error',
    OPEN_CHAT_EMIT: 'new_private_chat'
};
