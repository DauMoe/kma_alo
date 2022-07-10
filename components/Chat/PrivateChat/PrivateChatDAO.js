const { query } = require("../../../Utils/DB_connection");
const mysql = require("mysql");
const { DB_RESP, DB_ERR } = require("../../../Utils/UtilsFunction");
const { v4: uuidv4, v1: uuidv3 } = require("uuid");

const FILE_NAME = " - PrivateChatDAO.js";
const MessageType = {
    TEXT: "TEXT",
    VIDEO: "VIDEO",
    VOICE: "VOICE"
}
exports.GetAllPrivateChatIDDAO = async(uid) => {
    const FUNC_NAME = "GetAllPrivateChatIDDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT * FROM USERS WHERE UID = ?";
        SQL_BIND    = mysql.format(SQL, [uid]);
        const r1    = await query(SQL_BIND);
        if (r1.length === 0) {
            return DB_RESP(400, "User ID is not exist");
        }
        SQL         = `SELECT f.CONTENT, f.TYPE, f.CREATED_AT, f.PRIVATE_CHAT_MSG_ID, a.ROOM_CHAT_ID, a.UID_ONE, a.UID_TWO, b.USERNAME, b.AVATAR_LINK, b.FIRST_NAME, b.LAST_NAME FROM PRIVATE_CHAT a JOIN USERS b ON ((a.UID_ONE = ? AND a.UID_TWO = b.UID) OR (a.UID_TWO = ? AND a.UID_ONE = b.UID)) LEFT JOIN (select c.* from private_chat_message c join (select d.ROOM_CHAT_ID, max(d.CREATED_AT) last_time from private_chat_message d group by ROOM_CHAT_ID) t on t.ROOM_CHAT_ID = c.ROOM_CHAT_ID AND t.last_time = c.CREATED_AT) f ON f.ROOM_CHAT_ID = a.ROOM_CHAT_ID`;
        SQL_BIND    = mysql.format(SQL, [uid, uid]);
        const r2    = await query(SQL_BIND);
        return DB_RESP(200, r2);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.CreateNewPrivateChatDAO = async(fromUID, toUID) => {
    const FUNC_NAME = "CreateNewPrivateChatDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        //Check UID valid?
        if (fromUID === toUID) return DB_RESP(400, "You can't chat with yourself, right?");
        SQL         = "SELECT * FROM USERS WHERE UID = ? OR UID = ?";
        SQL_BIND    = mysql.format(SQL, [fromUID, toUID]);
        const r1    = await query(SQL_BIND);
        if (r1.length < 2) {
            return DB_RESP(403, "User ID is not exist");
        }

        //Check chat existed?
        SQL         = "SELECT * FROM PRIVATE_CHAT WHERE (UID_ONE = ? AND UID_TWO = ?) OR (UID_ONE = ? AND UID_TWO = ?)";
        SQL_BIND    = mysql.format(SQL, [fromUID, toUID, toUID, fromUID]);
        const r2    = await query(SQL_BIND);
        if (r2.length > 0) {
            return DB_RESP(401, "You already have a chat with this person");
        }
        //Insert new chat to DB
        SQL         = "INSERT INTO PRIVATE_CHAT (EMIT_EVENT_ID, LISTEN_EVENT_ID, UID_ONE, UID_TWO) VALUES (?, ? , ?, ?)";
        SQL_BIND    = mysql.format(SQL, [uuidv4(), uuidv3(), fromUID, toUID]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch(e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.SavePrivateMessageToDBDAO = async(room_name, sender_id, receiver_id, content) => {
    const FUNC_NAME = "SavePrivateMessageToDBDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL = "INSERT INTO PRIVATE_CHAT_MESSAGE (PRIVATE_CHAT_MSG_ID, CONTENT, TYPE, SENDER_ID, RECEIVER_ID, ROOM_CHAT_ID) VALUES (?, ?, ?, ?, ?, ?)";
        SQL_BIND = mysql.format(SQL, [uuidv4(), content, MessageType.TEXT, sender_id, receiver_id, room_name]);
        await query(SQL_BIND);
        return DB_RESP(200);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetMessageHistoryDAO = async(uid, offset, limit, receiver_id) => {
    const FUNC_NAME = "GetMessageHistoryDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL = "SELECT * FROM PRIVATE_CHAT_MESSAGE a JOIN USERS b ON a.RECEIVER_ID = b.UID WHERE (a.SENDER_ID = ? AND a.RECEIVER_ID = ?) OR (a.SENDER_ID = ? AND a.RECEIVER_ID = ?) ORDER BY a.CREATED_AT DESC LIMIT ?,?";
        SQL_BIND = mysql.format(SQL, [uid, receiver_id, receiver_id, uid, offset, limit]);
        const result = await query(SQL_BIND);
        return DB_RESP(200, result);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}