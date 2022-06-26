const { GetNumber } = require("../../../Utils/GetValue");
const { CatchErr, RespCustomCode, SuccessResp } = require("../../../Utils/UtilsFunction");
const { GetAllPrivateChatIDDAO, CreateNewPrivateChatDAO } = require("./PrivateChatDAO");

const FILE_NAME = " - PrivateChatController.js";

exports.GetAllPrivateChatID = async(req, resp) => {
    const FUNC_NAME = "GetAllPrivateChatID" + FILE_NAME;
    const reqData = req.params;
    try {
        const uid           = GetNumber(reqData, "uid");
        const result        = await GetAllPrivateChatIDDAO(uid);
        const respResult    = [];
        if (result.code === 200) {
            for (const i of result.msg) {
                respResult.push({
                    private_chat_id : i.PRIVATE_CHAT_EVENT_ID   === null ? "" : i.PRIVATE_CHAT_EVENT_ID,
                    username        : i.USERNAME                === null ? "" : i.USERNAME,
                    uid             : i.UID                     === null ? -1 : i.UID,
                    avatar          : i.AVATAR_LINK             === null ? "" : i.AVATAR_LINK
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