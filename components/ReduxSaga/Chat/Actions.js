import {LOADED_LIST_CHATS_FAIL, LOADED_LIST_CHATS_SUCCESS, LOADING_LIST_CHATS} from "./ActionTypes";

export const GetListChats = function() {
    return {
        type: LOADING_LIST_CHATS
    }
}

export const GetListChatsSuccess = function(data) {
    return {
        type: LOADED_LIST_CHATS_SUCCESS,
        data: data
    }
}

export const GetListChatsFail = function(err) {
    return {
        type: LOADED_LIST_CHATS_FAIL,
        data: err
    }
}