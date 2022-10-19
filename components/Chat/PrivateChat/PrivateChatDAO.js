const { query } = require("../../../Utils/DB_connection");
const mysql = require("mysql");
const { DB_RESP, DB_ERR } = require("../../../Utils/UtilsFunction");
const { v4: uuidv4, v1: uuidv3 } = require("uuid");

const FILE_NAME = " - PrivateChatDAO.js";

const GetAllPrivateChatIDDAO = async(uid) => {
    const FUNC_NAME = "GetAllPrivateChatIDDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL         = "SELECT * FROM USERS WHERE UID = ?";
        SQL_BIND    = mysql.format(SQL, [uid]);
        const r1    = await query(SQL_BIND);
        if (r1.length === 0) {
            return DB_RESP(400, "User ID is not exist");
        }
        SQL         = `SELECT f.CONTENT, f.TYPE, f.CREATED_AT, f.STATUS, f.PRIVATE_CHAT_MSG_ID, a.ROOM_CHAT_ID, a.UID_ONE, a.UID_TWO, b.USERNAME, b.AVATAR_LINK, b.FIRST_NAME, b.LAST_NAME FROM PRIVATE_CHAT a JOIN USERS b ON ((a.UID_ONE = ? AND a.UID_TWO = b.UID) OR (a.UID_TWO = ? AND a.UID_ONE = b.UID)) LEFT JOIN (select c.* from private_chat_message c join (select d.ROOM_CHAT_ID, max(d.CREATED_AT) last_time from private_chat_message d group by ROOM_CHAT_ID) t on t.ROOM_CHAT_ID = c.ROOM_CHAT_ID AND t.last_time = c.CREATED_AT) f ON f.ROOM_CHAT_ID = a.ROOM_CHAT_ID`;
        SQL_BIND    = mysql.format(SQL, [uid, uid]);
        const r2    = await query(SQL_BIND);
        return DB_RESP(200, r2);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

const CreateNewPrivateChatDAO = async(fromUID, toUID) => {
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
        const room_chat_id = uuidv4();
        SQL         = "INSERT INTO PRIVATE_CHAT (ROOM_CHAT_ID, UID_ONE, UID_TWO) VALUES (?, ?, ?)";
        SQL_BIND    = mysql.format(SQL, [room_chat_id, fromUID, toUID]);
        await query(SQL_BIND);
        SQL         = "INSERT INTO PRIVATE_CHAT_MESSAGE (PRIVATE_CHAT_MSG_ID, CONTENT, TYPE, SENDER_ID, RECEIVER_ID, ROOM_CHAT_ID, STATUS) VALUES (?, '*System*: You are connected', 'TEXT', ?, ?, ?, 'SEEN')";
        SQL_BIND    = mysql.format(SQL, [uuidv4(), fromUID, toUID, room_chat_id]);
        await query(SQL_BIND);
        return DB_RESP(200, {
            room_chat_id: room_chat_id
        });
    } catch(e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.SavePrivateMessageToDBDAO = async(room_name, sender_id, receiver_id, content, status, type) => {
    const FUNC_NAME = "SavePrivateMessageToDBDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL = "INSERT INTO PRIVATE_CHAT_MESSAGE (PRIVATE_CHAT_MSG_ID, CONTENT, TYPE, SENDER_ID, RECEIVER_ID, ROOM_CHAT_ID, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?)";
        SQL_BIND = mysql.format(SQL, [uuidv4(), content, type, sender_id, receiver_id, room_name, status]);
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
        SQL         = "UPDATE PRIVATE_CHAT_MESSAGE SET STATUS = 'SEEN' WHERE SENDER_ID = ? AND RECEIVER_ID = ?";
        SQL_BIND    = mysql.format(SQL, [uid, receiver_id]);
        await query(SQL_BIND);
        SQL         = "SELECT * FROM PRIVATE_CHAT_MESSAGE a JOIN USERS b ON a.RECEIVER_ID = b.UID WHERE (a.SENDER_ID = ? AND a.RECEIVER_ID = ?) OR (a.SENDER_ID = ? AND a.RECEIVER_ID = ?) ORDER BY a.CREATED_AT DESC LIMIT ?,?";
        SQL_BIND    = mysql.format(SQL, [uid, receiver_id, receiver_id, uid, offset, limit]);
        const result = await query(SQL_BIND);
        SQL          = "SELECT COUNT(*) FROM PRIVATE_CHAT_MESSAGE WHERE (SENDER_ID = ? AND RECEIVER_ID = ?) OR (SENDER_ID = ? AND RECEIVER_ID = ?)";
        SQL_BIND     = mysql.format(SQL, [uid, receiver_id, receiver_id, uid]);
        const result1 = await query(SQL_BIND);
        return DB_RESP(200, {
            content: result,
            total: result1[0]['COUNT(*)']
        });
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetChatInfoDAO = async(own_uid, to_uid) => {
    const FUNC_NAME = "GetChatInfoDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {
        SQL = "SELECT * FROM PRIVATE_CHAT b WHERE (b.UID_ONE = ? AND b.UID_TWO = ?) OR (b.UID_ONE = ? AND b.UID_TWO = ?)";
        SQL_BIND = mysql.format(SQL, [own_uid, to_uid, to_uid, own_uid]);
        const result = await query(SQL_BIND);
        let room_chat_id;
        if (result.length === 0) {
            //No conversation before
            const result1 = await CreateNewPrivateChatDAO(own_uid, to_uid);
            if (result1.code !== 200) {
                return DB_RESP(result1.code, result1.msg);
            }
            room_chat_id = result1.msg.room_chat_id;
        } else {
            room_chat_id = result[0].ROOM_CHAT_ID;
        }
        SQL = "SELECT * FROM USERS WHERE UID = ? OR UID = ?";
        SQL_BIND = mysql.format(SQL, [own_uid, to_uid]);
        const result2 = await query(SQL_BIND);
        let respData = {
            ROOM_CHAT_ID: room_chat_id
        };
        for (const user of result2) {
            if (user.UID === own_uid) {
                respData = {
                    ...respData,
                    SENDER_UID: user.UID,
                    SENDER_FIRST_NAME: user.FIRST_NAME,
                    SENDER_LAST_NAME: user.LAST_NAME,
                    SENDER_USERNAME: user.USERNAME,
                    SENDER_AVATAR_LINK: user.AVATAR_LINK,
                    SENDER_DISPLAY_NAME: `${user.FIRST_NAME} ${user.LAST_NAME}`,
                    SENDER_AVATAR_TEXT: `${user.FIRST_NAME[0]}${user.LAST_NAME[0]}`
                }
            }
            if (user.UID === to_uid) {
                respData = {
                    ...respData,
                    RECEIVER_UID: user.UID,
                    RECEIVER_FIRST_NAME: user.FIRST_NAME,
                    RECEIVER_LAST_NAME: user.LAST_NAME,
                    RECEIVER_USERNAME: user.USERNAME,
                    RECEIVER_AVATAR_LINK: user.AVATAR_LINK,
                    RECEIVER_DISPLAY_NAME: `${user.FIRST_NAME} ${user.LAST_NAME}`,
                    RECEIVER_AVATAR_TEXT: `${user.FIRST_NAME[0]}${user.LAST_NAME[0]}`
                }
            }
        }
        SQL             = "SELECT * FROM RELATIONS WHERE (UID_ONE = ? AND UID_TWO = ?) OR (UID_ONE = ? AND UID_TWO = ?)";
        SQL_BIND        = mysql.format(SQL, [own_uid, to_uid, to_uid, own_uid]);
        const result3   = await query(SQL_BIND);
        if (result3.length === 0) {
            respData = {
                ...respData,
                RELATIONS: "NOT_FRIEND"
            }
        } else {
            respData = {
                ...respData,
                RELATIONS: result3[0].TYPE
            }
        }
        return DB_RESP(200, respData);
    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.NewMessageDAO = async (sender_id, receiver_id, content, type, room_chat_id) => {
    const FUNC_NAME = "NewMessageDAO" + FILE_NAME;
    let SQL, SQL_BIND;
    try {

    } catch (e) {
        DB_ERR(FUNC_NAME, SQL_BIND, e.message);
        return DB_RESP(503, e.message);
    }
}

exports.GetAllPrivateChatIDDAO = GetAllPrivateChatIDDAO;
exports.CreateNewPrivateChatDAO = CreateNewPrivateChatDAO;
