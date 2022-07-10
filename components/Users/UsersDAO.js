const {query} = require("../../Utils/DB_connection");
const mysql = require("mysql");
const {v4: uuidv4} = require("uuid");
const { DB_RESP, DB_ERR } = require("../../Utils/UtilsFunction");

const FILE_NAME = " - UsersDAO.js";

exports.NewLocalUserDAO = async (first_name, last_name, username, mobile, email, password) => {
    const FUNC_NAME = `NewLocalUserDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT UID FROM USERS WHERE USERNAME = ? OR EMAIL = ?";
        SQL_BIND    = mysql.format(SQL, [username, email]);
        const r1    = await query(SQL_BIND);
        if (r1.length > 0) {
            return DB_RESP(400, "Email or username existed");
        } else {
            SQL                 = "INSERT INTO USERS (FIRST_NAME, LAST_NAME, USERNAME, MOBILE, EMAIL, PASSWORD, EMAIL_CONFIRMED) VALUES (?, ?, ?, ?, ?, ?, ?)";
            SQL_BIND            = mysql.format(SQL, [first_name, last_name, username, mobile, email, password, 0]);
            const {insertId}    = await query(SQL_BIND);
            SQL                 = "UPDATE USERS SET VERIFY_EMAIL_ID = ? WHERE UID = ?";
            const cf_id         = uuidv4();
            SQL_BIND            = mysql.format(SQL, [insertId, cf_id]);
            await query(SQL_BIND);
            return DB_RESP(200, cf_id);
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND);
        return DB_RESP(503, e);
    }
}

exports.LocalLoginDAO = async(username) => {
    const FUNC_NAME = `LocalLoginDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT DISTINCT * FROM USERS WHERE USERNAME = ? OR EMAIL = ?";
        SQL_BIND    = mysql.format(SQL, [username, username]);
        const r1    = await query(SQL_BIND);
        if (r1.length > 0) {
            return DB_RESP(200, r1);
        } else {
            return DB_RESP(401, "Account is not exist!");
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetUserInfoDAO = async(uid) => {
    const FUNC_NAME = `GetUserInfoDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT * FROM USERS WHERE UID = ?";
        SQL_BIND    = mysql.format(SQL, [uid]);
        const r1    = await query(SQL_BIND);
        return DB_RESP(200, r1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.ActiveAccountDAO = async(uuid) => {
    const FUNC_NAME = `ActiveAccountDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "UPDATE USERS SET EMAIL_CONFIRMED = 1 WHERE VERIFY_EMAIL_ID = ?";
        SQL_BIND    = mysql.format(SQL, [uuid]);
        await query(SQL_BIND);
        return DB_RESP(200, "Success");
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetProfileInformationDAO = async(uid) => {
    const FUNC_NAME = `GetProfileInformationDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "SELECT * FROM USERS WHERE UID = ?";
        SQL_BIND        = mysql.format(SQL, [uid]);
        const result    = await query(SQL_BIND);
        return DB_RESP(200, result);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.UpdateUserInfoDAO = async(uid, first_name, last_name, username, email, mobile, information) => {
    const FUNC_NAME = `UpdateUserInfoDAO${FILE_NAME}`;
    let SQL, SQL_BIND = "";
    try {
        SQL             = "UPDATE USERS SET FIRST_NAME = ?, LAST_NAME = ?, USERNAME = ?, MOBILE = ?, EMAIL = ?, INFORMATION = ? WHERE UID = ?";
        SQL_BIND        = mysql.format(SQL, [first_name, last_name, username, mobile, email, information, uid]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}
