const { GetNumber, GetString } = require("../../../Utils/GetValue");
const { CatchErr, RespCustomCode, SuccessResp, writeFile, SENT, IMAGE} = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatIDDAO, CreateNewPrivateChatDAO, SavePrivateMessageToDBDAO, GetMessageHistoryDAO,
    GetChatInfoDAO,
    NewMessageDAO
} = require("./PrivateChatDAO");
const path = require("path");

const FILE_NAME = " - PrivateChatController.js";

exports.GetAllPrivateChatID = async(req, resp) => {
    const FUNC_NAME = "GetAllPrivateChatID" + FILE_NAME;
    try {
        const uid           = req.app.locals.uid;
        const result        = await GetAllPrivateChatIDDAO(uid);
        const respResult    = [], listUnReadMessage = [];

        if (result.code === 200) {
            for (const i of result.msg) {
                const item = {
                    receiver_first_name : i.FIRST_NAME              === null ? "" : i.FIRST_NAME,
                    receiver_last_name  : i.LAST_NAME               === null ? "" : i.LAST_NAME,
                    room_chat_id        : i.ROOM_CHAT_ID            === null ? "" : i.ROOM_CHAT_ID,
                    receiver_username   : i.USERNAME                === null ? "" : i.USERNAME,
                    receiver_avatar     : i.AVATAR_LINK             === null ? "" : `/avatar/${i.AVATAR_LINK}`,
                    receiver_avatar_text: `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`,
                    display_name        : `${i.FIRST_NAME} ${i.LAST_NAME}`,
                    receiver_uid        : (i.UID_ONE !== null &&i.UID_ONE !== uid) ? i.UID_ONE : i.UID_TWO,
                    last_send           : i.CREATED_AT              === null ? "" : i.CREATED_AT,
                    last_message        : i.TYPE                    === IMAGE ? "<Image>" : i.CONTENT === null ? "" : i.CONTENT,
                    last_message_id     : i.PRIVATE_CHAT_MSG_ID     === null ? "" : i.PRIVATE_CHAT_MSG_ID,
                    message_type        : i.TYPE                    === null ? "" : i.TYPE,
                    sender_id           : (i.UID_ONE !== null &&i.UID_ONE === uid) ? i.UID_ONE : i.UID_TWO,
                    status              : i.STATUS                  === null ? SENT : i.STATUS
                }
                if (item.status === SENT && listUnReadMessage.indexOf(i.receiver_uid) === -1) listUnReadMessage.push(i.receiver_uid);
                respResult.push(item);
            }
            SuccessResp(resp, {
                list_chat   : respResult,
                unread      : listUnReadMessage.length
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
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
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

const MessageType = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    VOICE: "VOICE"
}

exports.MessageType = MessageType;

exports.SavePrivateMessageToDB = async(room_name, sender_id, receiver_id, content, status, type) => {
    const FUNC_NAME = "SavePrivateMessageToDB" + FILE_NAME;
    try {
        if (type === "IMAGE") {
            const avatarBase64  = content;
            const pathImage     = `_conversation_${new Date().getTime()}.jpg`;
            await writeFile(path.join(__dirname, "..", "..", "..", "public", "conversation", pathImage), avatarBase64.replace(/^data:image\/png;base64,/, ""), "base64");
            const result = await SavePrivateMessageToDBDAO(room_name, sender_id, receiver_id, pathImage, status, type);
            return result;
        } else {
            const result = await SavePrivateMessageToDBDAO(room_name, sender_id, receiver_id, content, status, type);
            return result;
        }
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
                    msg                 : i.CONTENT             === null ? "" : i.TYPE === MessageType.IMAGE ? `/conversation/${i.CONTENT}` : i.CONTENT,
                    type                : i.TYPE                === null ? "" : i.TYPE,
                    created_at          : i.CREATED_AT          === null ? "" : i.CREATED_AT,
                    receiver_id         : i.RECEIVER_ID         === null ? "" : i.RECEIVER_ID,
                    sender_id           : i.SENDER_ID           === null ? "" : i.SENDER_ID,
                    sender              : i.SENDER_ID           === uid,
                    receiver_first_name : i.FIRST_NAME          === null ? "" : i.FIRST_NAME,
                    receiver_last_name  : i.LAST_NAME           === null ? "" : i.LAST_NAME,
                    receiver_avatar     : i.AVATAR              === null ? "" : i.AVATAR,
                    state               : i.STATUS              === null ? SENT : i.STATUS,
                    receiver_avatar_text: `${i.FIRST_NAME[0]}${i.LAST_NAME[0]}`
                });
            }
            SuccessResp(resp, {
                chat_history: respResult.reverse(),
                next_offset: offset + respResult.length,
                limit: limit
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch (e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.GetChatInfo = async(req, resp) => {
    const FUNC_NAME = "GetChatInfo" + FILE_NAME;
    const reqData = req.query;
    try {
        const own_uid = req.app.locals.uid;
        const to_uid =  GetNumber(reqData, "to_uid");
        const result = await GetChatInfoDAO(own_uid, to_uid);
        if (result.code === 200) {
            const i = result.msg;
            const respData = {
                room_chat_id        : i.ROOM_CHAT_ID            === null ? "" : i.ROOM_CHAT_ID,
                sender_uid          : i.SENDER_UID              === null ? -1 : i.SENDER_UID,
                sender_first_name   : i.SENDER_FIRST_NAME       === null ? "" : i.SENDER_FIRST_NAME,
                sender_last_name    : i.SENDER_LAST_NAME        === null ? "" : i.SENDER_LAST_NAME,
                sender_username     : i.SENDER_USERNAME         === null ? "" : i.SENDER_USERNAME,
                sender_avatar_link  : i.SENDER_AVATAR_LINK      === null ? "" : `/avatar/${i.SENDER_AVATAR_LINK}`,
                sender_avatar_text  : i.SENDER_AVATAR_TEXT      === null ? "" : i.SENDER_AVATAR_TEXT,
                receiver_uid        : i.RECEIVER_UID            === null ? -1 : i.RECEIVER_UID,
                receiver_first_name : i.RECEIVER_FIRST_NAME     === null ? "" : i.RECEIVER_FIRST_NAME,
                receiver_last_name  : i.RECEIVER_LAST_NAME      === null ? "" : i.RECEIVER_LAST_NAME,
                receiver_username   : i.RECEIVER_USERNAME       === null ? "" : i.RECEIVER_USERNAME,
                receiver_avatar_link: i.RECEIVER_AVATAR_LINK    === null ? "" : `/avatar/${i.RECEIVER_AVATAR_LINK}`,
                receiver_avatar_text: i.RECEIVER_AVATAR_TEXT    === null ? "" : i.RECEIVER_AVATAR_TEXT,
                receiver_display_name: `${i.RECEIVER_FIRST_NAME} ${i.RECEIVER_LAST_NAME}`,
                sender_display_name: `${i.SENDER_FIRST_NAME} ${i.SENDER_LAST_NAME}`,
                relations           : i.RELATIONS
            };
            SuccessResp(resp, respData);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.NewMessage = async(req, resp) => {
    const FUNC_NAME = "NewMessage" + FILE_NAME;
    const reqData = req.body;
    try {
        const sender_id     = GetNumber(reqData, "sender_id");
        const receiver_id   = GetNumber(reqData, "receiver_id");
        const content       = GetString(reqData, "msg");
        const type          = GetString(reqData, "type");
        const room_chat_id  = GetString(reqData, "room_chat_id");
        const status        = GetString(reqData, "status");

        if (type === "IMAGE") {
            const avatarBase64  = content;
            const pathImage     = `_conversation_${new Date().getTime()}.jpg`;
            await writeFile(path.join(__dirname, "..", "..", "..", "public", "conversation", pathImage), avatarBase64.replace(/^data:image\/png;base64,/, ""), "base64");
            const result = await SavePrivateMessageToDBDAO(room_chat_id, sender_id, receiver_id, pathImage, status, type);
            if (result.code === 200) {
                SuccessResp(resp);
            } else {
                RespCustomCode(resp, undefined, result.msg, result.code);
            }
        } else {
            const result = await SavePrivateMessageToDBDAO(room_chat_id, sender_id, receiver_id, content, status, type);
            if (result.code === 200) {
                SuccessResp(resp);
            } else {
                RespCustomCode(resp, undefined, result.msg, result.code);
            }
        }
    }catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}
