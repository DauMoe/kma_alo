const { GetNumber } = require("../../../Utils/GetValue");
const { CatchErr, RespCustomCode, SuccessResp } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatIDDAO, CreateNewPrivateChatDAO, SavePrivateMessageToDBDAO, GetMessageHistoryDAO} = require("./PrivateChatDAO");

const FILE_NAME = " - PrivateChatController.js";

exports.GetAllPrivateChatID = async(req, resp) => {
    const FUNC_NAME = "GetAllPrivateChatID" + FILE_NAME;
    try {
        const uid           = req.app.locals.uid;
        const result        = await GetAllPrivateChatIDDAO(uid);
        const respResult    = [];
        if (result.code === 200) {
            for (const i of result.msg) {
                respResult.push({
                    receiver_first_name : i.FIRST_NAME              === null ? "" : i.FIRST_NAME,
                    receiver_last_name  : i.LAST_NAME               === null ? "" : i.LAST_NAME,
                    room_chat_id        : i.ROOM_CHAT_ID            === null ? "" : i.ROOM_CHAT_ID,
                    receiver_username   : i.USERNAME                === null ? "" : i.USERNAME,
                    receiver_avatar     : i.AVATAR_LINK             === null ? "" : i.AVATAR_LINK,
                    receiver_avatar_text: `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    receiver_uid        : (i.UID_ONE !== null &&i.UID_ONE !== uid) ? i.UID_ONE : i.UID_TWO,
                    last_send           : i.CREATED_AT              === null ? "" : i.CREATED_AT,
                    last_message        : i.CONTENT                 === null ? "" : i.CONTENT,
                    last_message_id     : i.PRIVATE_CHAT_MSG_ID     === null ? "" : i.PRIVATE_CHAT_MSG_ID,
                    message_type        : i.TYPE                    === null ? "" : i.TYPE,
                    sender_id           : (i.UID_ONE !== null &&i.UID_ONE === uid) ? i.UID_ONE : i.UID_TWO,
                });
            }
            SuccessResp(resp, respResult);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
};

exports.CreateNewPrivateChat = async(req, resp) => {
    const FUNC_NAME = "CreateNewPrivateChat" + FILE_NAME;
    const reqData   = req.body;
    try {
        const toUid     = GetNumber(reqData, "uid");
        const fromUid   = req.app.locals.uid;
        const result    = await CreateNewPrivateChatDAO(fromUid, toUid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.SavePrivateMessageToDB = async(room_name, sender_id, receiver_id, content) => {
    const FUNC_NAME = "SavePrivateMessageToDB" + FILE_NAME;
    try {
        const result = await SavePrivateMessageToDBDAO(room_name, sender_id, receiver_id, content);
        return result;
    } catch (e) {
        console.error(`${FUNC_NAME}: ${e.message}`);
    }
}

exports.GetMessageHistory = async(req, resp) => {
    const FUNC_NAME = "GetMessageHistory" + FILE_NAME;
    const reqData = req.query;
    try {
        const uid           = req.app.locals.uid;
        const offset        = GetNumber(reqData, "offset");
        const limit         = GetNumber(reqData, "limit");
        const receiver_id   = GetNumber(reqData, "receiver_id");
        const result        = await GetMessageHistoryDAO(uid, offset, limit, receiver_id);
        if (result.code === 200) {
            let respResult = [];
            for (const i of result.msg) {
                respResult.push({
                    private_chat_msg_id : i.PRIVATE_CHAT_MSG_ID === null ? "" : i.PRIVATE_CHAT_MSG_ID,
                    msg                 : i.CONTENT             === null ? "" : i.CONTENT,
                    type                : i.TYPE                === null ? "" : i.TYPE,
                    created_at          : i.CREATED_AT          === null ? "" : i.CREATED_AT,
                    receiver_id         : i.RECEIVER_ID         === null ? "" : i.RECEIVER_ID,
                    sender_id           : i.SENDER_ID           === null ? "" : i.SENDER_ID,
                    sender              : i.SENDER_ID           === uid,
                    receiver_first_name : i.FIRST_NAME          === null ? "" : i.FIRST_NAME,
                    receiver_last_name  : i.LAST_NAME           === null ? "" : i.LAST_NAME,
                    receiver_avatar     : i.AVATAR              === null ? "" : i.AVATAR,
                    receiver_avatar_text: `${i.FIRST_NAME[0]}${i.LAST_NAME}`,
                    state               : "SENT",
                    receiver_avatar_text: `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`
                });
            }
            SuccessResp(resp, {
                chat_history: respResult.reverse(),
                next_offset: offset + respResult.length,
                limit: limit
            });
        } else {
            RespCustomCode(resp, result.code, result.msg);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}