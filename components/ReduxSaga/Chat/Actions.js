import {
    LOADED_CHAT_HISTORY_FAIL,
    LOADED_CHAT_HISTORY_SUCCESS,
    LOADED_LIST_CHATS_FAIL,
    LOADED_LIST_CHATS_SUCCESS,
    LOADING_CHAT_HISTORY,
    LOADING_LIST_CHATS
} from "./ActionTypes";

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

export const GetChatHistory = function(offset, limit) {
    return {
        type: LOADING_CHAT_HISTORY,
        data: { offset, limit }
    }
}

export const GetChatHistorySuccess = function(data) {
    return {
        type: LOADED_CHAT_HISTORY_SUCCESS,
        data: data
    }
}

export const GetChatHistoryFail = function(err) {
    return {
        type: LOADED_CHAT_HISTORY_FAIL,
        data: err
    }
}