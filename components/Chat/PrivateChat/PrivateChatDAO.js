const { query } = require("../../../Utils/DB_connection");
const mysql = require("mysql");
const { DB_RESP, DB_ERR } = require("../../../Utils/UtilsFunction");

const FILE_NAME = " - PrivateChatDAO.js";

exports.GetAllPrivateChatIDDAO = async(uid) => {
    const FUNC_NAME = "GetAllPrivateChatIDDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT * FROM PRIVATE_CHAT a, UID b WHERE (a.UID_ONE = ? OR a.UID_TWO = ?) AND a.UID = b.UID";
        SQL_BIND    = mysql.format(SQL, [uid, uid]);
        const r1    = await query(SQL_BIND);
        return DB_RESP(200, r1);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(900, e.message);
    }
}