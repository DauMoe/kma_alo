//Write base64 to image: https://stackoverflow.com/questions/6926016/how-can-i-save-a-base64-encoded-image-to-disk

const {CatchErr, writeFile, SuccessResp, RespCustomCode} = require("../../Utils/UtilsFunction");
const {GetString, GetStringArray, GetNumber, GetJSONArray} = require("../../Utils/GetValue");
const fs = require("fs");
const path = require("path");
const {CreatePostDAO, DeletePostDAO, GetPostDAO} = require("./PostsDAO");

const FILE_NAME = " - PostController.js";

exports.CreatePost = async(req, resp) => {
    const FUNC_NAME = "CreatePost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const title     = GetString(reqData, "title");
        const content   = GetString(reqData, "content");
        const media     = GetJSONArray(reqData, "media");
        const ListMediaPaths = [];
        const ListPromise = [];
        for (const i of media) {
            const pathMedia = `_post_${new Date().getTime()}${path.extname(i.type)}`;
            ListMediaPaths.push(pathMedia);
            ListPromise.push(writeFile(path.join(__dirname, "..", "..", "public", "post", pathMedia), i.content.replace(/^data:image\/png;base64,/, ""), "base64"));
        }
        await Promise.all(ListPromise);
        const result = await CreatePostDAO(uid, title, content, ListMediaPaths);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.DeletePost = async(req, resp) => {
    const FUNC_NAME = "DeletePost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.body;
    try {
        const post_id = GetNumber(reqData, "post_id");
        const result = await DeletePostDAO(post_id, uid);
        if (result.code === 200) {
            SuccessResp(resp);
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}

exports.GetPost = async(req, resp) => {
    const FUNC_NAME = "GetPost" + FILE_NAME;
    const uid       = req.app.locals.uid;
    const reqData   = req.query;
    try {
        const offset    = GetNumber(reqData, "offset");
        const limit     = GetNumber(reqData, "limit");
        const result    = await GetPostDAO(uid, offset, limit);
        if (result.code === 200) {
            let respData = [];
            for (const i of result.msg) {
                const mediaLinks = [];
                for(const j of i.MEDIA_LINKS.split(",")) {
                    mediaLinks.push(`/post/${j}`);
                }
                respData.push({
                    post_id: i.POST_ID,
                    author_id: i.AUTHOR_ID,
                    title: i.TITLE,
                    content: i.CONTENT,
                    media: (i.MEDIA_LINKS === "" || i.MEDIA_LINKS === null) ? [] : mediaLinks
                })
            }
            SuccessResp(resp, {
                list_post   : respData,
                offset      : offset + respData.length,
                limit       : limit
            });
        } else {
            RespCustomCode(resp, undefined, result.msg, result.code);
        }
    } catch(e) {
        CatchErr(resp, e, FUNC_NAME);
    }
}