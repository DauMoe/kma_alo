const {query} = require("./../../Utils/DB_connection");
const mysql = require("mysql");
const { DB_RESP, DB_ERR } = require("../../Utils/UtilsFunction");

const FILE_NAME = " - UsersDAO.js";

exports.NewLocalUserDAO = async (first_name, last_name, username, mobile, email, password) => {
    const FUNC_NAME = `NewLocalUserDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT UID FROM USERS WHERE MOBILE = ? OR EMAIL = ?";
        SQL_BIND    = mysql.format(SQL, [mobile, email]);
        const r1    = await query(SQL_BIND);
        if (r1.length > 0) {
            return DB_RESP(900, "Số điện thoại hoặc email đã tồn tại!");
        } else {
            SQL         = "INSERT INTO USERS (FIRST_NAME, LAST_NAME, USERNAME, MOBILE, EMAIL, PASSWORD, EMAIL_CONFIRMED) VALUES (?, ?, ?, ?, ?, ?, ?)";
            SQL_BIND    = mysql.format(SQL, [first_name, last_name, username, mobile, email, password, 0]);
            const r2    = await query(SQL_BIND);
            return DB_RESP(200);
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND);
        return DB_RESP(900, e);
    }
}

exports.LocalLoginDAO = async(username) => {
    const FUNC_NAME = `LocalLoginDAO${FILE_NAME}`;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT DISTINCT * FROM USERS WHERE USERNAME = ? OR EMAIL = ?";
        SQL_BIND    = mysql.format(SQL, [username, username]);
        const r1    = await query(SQL_BIND);
        console.log(r1);
        if (r1.length > 0) {
            return DB_RESP(200, r1);
        } else {
            return DB_RESP(900, "Tài khoản không tồn tại");
        }
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(900, e.message);
    }
}