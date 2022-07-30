const bcrypt = require("bcrypt");
const { GetString, GetNumber } = require("../../Utils/GetValue");
const { CatchErr, SuccessResp, RespCustomCode, CREATE_TRANSPORTER, SALT_ROUND, JWT_SECRET_KEY, HOST_ADDRESS, writeFile} = require("../../Utils/UtilsFunction");
const { NewLocalUserDAO, LocalLoginDAO, GetUserInfoDAO, ActiveAccountDAO, GetProfileInformationDAO, UpdateUserInfoDAO,
    UpdateAvatarDAO
} = require("./UsersDAO");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const url = require("url");
const fs = require("fs");
const {response} = require("express");
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
    destination: function (req, file, cb) {
        cb(null, "public/avatar")
    }
})
const avatarUpload =  multer({ storage: storage }).single("avatar");

const FILE_NAME = " - UsersController.js";


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
        const result = await GetUserInfoDAO(uid);
        if (result.code === 200) {
            const data = result.msg[0];
            const UserData = {
                first_name      : data.FIRST_NAME       === null ? "" : data.FIRST_NAME,
                last_name       : data.LAST_NAME        === null ? "" : data.LAST_NAME,
                username        : data.USERNAME         === null ? "" : data.USERNAME,
                mobile          : data.MOBILE           === null ? "" : data.MOBILE,
                email           : data.EMAIL            === null ? "" : data.EMAIL,
                email_confirmed : data.EMAIL_CONFIRMED  === 1,
                avatar_link     : data.AVATAR_LINK      === null ? "" : `/avatar/${data.AVATAR_LINK}`,
                avatar_text     : `${data.FIRST_NAME[0]}${data.LAST_NAME[0]}`,
                information     : data.INFORMATION      === null ? "" : data.INFORMATION
            };
            SuccessResp(resp, {user_data: UserData});
            // if (data.AVATAR_LINK !== null) {
            //     fs.readFile(path.join(__dirname, "..", "..", "public", "avatar", data.AVATAR_LINK), "utf-8", function(err, data) {
            //         UserData.avatar_link = data;
            //         SuccessResp(resp, {user_data: UserData});
            //     });
            // } else {
            //     SuccessResp(resp, {user_data: UserData});
            // }
        } else {
            RespCustomCode(resp, undefined, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.UpdateUserInfo = async(req, resp) => {
    const FUNC_NAME = "UpdateUserInfo" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const first_name    = GetString(reqData, "first_name");
        const last_name     = GetString(reqData, "last_name");
        const username      = GetString(reqData, "username");
        const email         = GetString(reqData, "email");
        const mobile        = GetString(reqData, "mobile");
        const information   = GetString(reqData, "information");
        const result        = await UpdateUserInfoDAO(uid, first_name, last_name, username, email, mobile, information);
        if (result.code === 200) {
            const result1 = await GetUserInfoDAO(uid);
            if (result1.code === 200) {
                const data = result1.msg[0];
                const UserData = {
                    first_name      : data.FIRST_NAME       === null ? "" : data.FIRST_NAME,
                    last_name       : data.LAST_NAME        === null ? "" : data.LAST_NAME,
                    username        : data.USERNAME         === null ? "" : data.USERNAME,
                    mobile          : data.MOBILE           === null ? "" : data.MOBILE,
                    email           : data.EMAIL            === null ? "" : data.EMAIL,
                    email_confirmed : data.EMAIL_CONFIRMED  === 1,
                    avatar_link     : data.AVATAR_LINK      === null ? "" : data.AVATAR_LINK,
                    avatar_text     : `${data.FIRST_NAME[0]}${data.LAST_NAME[0]}`,
                    information     : data.INFORMATION      === null ? "" : data.INFORMATION
                };
                SuccessResp(resp, {user_data: UserData});
            } else {
                RespCustomCode(resp, undefined, result.code, result.msg);
            }
        } else {
            RespCustomCode(resp, undefined, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.UpdateAvatar = async function(req, resp) {
    const FUNC_NAME = "UpdateAvatar" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const avatarBase64  = GetString(reqData, "avatarBase64");
        const pathImage     = `_avatar_${new Date().getTime()}.jpg`;
        await writeFile(path.join(__dirname, "..", "..", "public", "avatar", pathImage), avatarBase64.replace(/^data:image\/png;base64,/, ""), "base64");
        const result = await UpdateAvatarDAO(uid, pathImage);
        if (result.code === 200) {
            try {
                fs.unlinkSync(path.join(__dirname, "..", "..", "public", "avatar", result.msg[0].AVATAR_LINK));
            } catch(e) {}
            SuccessResp(resp, {
                avatar_link: `/avatar/${pathImage}`
            })
        } else {
            RespCustomCode(resp, undefined, result.code, result.msg);
        }
        // fs.writeFile(path.join(__dirname, "..", "..", "public", "avatar", pathImage) , avatarBase64, async function(err) {
        //     if (err) {
        //         RespCustomCode(resp, undefined, err, 405);
        //         return;
        //     }
        //     const result = await UpdateAvatarDAO(uid, pathImage);
        //     if (result.code === 200) {
        //         try {
        //             fs.unlinkSync(path.join(__dirname, "..", "..", "public", "avatar", result.msg[0].AVATAR_LINK));
        //         } catch(e) {}
        //         SuccessResp(resp, {
        //             avatarBase64: avatarBase64
        //         })
        //     } else {
        //         RespCustomCode(resp, undefined, result.code, result.msg);
        //     }
        // });

        // avatarUpload(req, resp, async function(err) {
        //     if (err instanceof  multer.MulterError) {
        //         RespCustomCode(resp, undefined, "Have error when upload file", 500);
        //     } else if (err) {
        //         RespCustomCode(resp, undefined, err, 400);
        //     } else {
        //         console.log(req.file);
        //         const pathFile = "/avatar/" + req.file.filename;
        //         const result = await UpdateAvatarDAO(uid, pathFile);
        //         if (result.code === 200) {
        //             SuccessResp(resp, {
        //                 avatar_path: pathFile
        //             })
        //         } else {
        //             RespCustomCode(resp, result.code, result.msg);
        //         }
        //     }
        // });
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.TokenValid = async(req, resp) => {
    SuccessResp(resp, undefined);
}