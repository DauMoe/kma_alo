import {
    LOADED_CHAT_HISTORY_FAIL,
    LOADED_CHAT_HISTORY_SUCCESS,
    LOADED_LIST_CHATS_FAIL,
    LOADED_LIST_CHATS_SUCCESS,
    LOADING_CHAT_HISTORY,
    LOADING_LIST_CHATS
} from "./ActionTypes";
import {LOAD_COMMENT_FAIL, LOAD_COMMENT_SUCCESS, LOADING_COMMENT} from "../Comments/Actions";

export const initState = {
    loaded  : false,
    error   : false,
    error_msg: undefined,
    data    : [],
    unread_count: true,
    chat_history: {
        ready: true,
        3: {
            chats: [],
            offset: 0,
            limit: 0
        }
    }
};

const Chats = function(state = initState, action) {
    const { type, data } = action;

    switch (type) {
        case LOADING_LIST_CHATS:
            return {
                ...state,
                loaded: false,
                error: false,
                error_msg: undefined,
                data: []
            }
        case LOADED_LIST_CHATS_SUCCESS:
            return {
                ...state,
                loaded: true,
                error: false,
                error_msg: undefined,
                data: data.list_chat,
                unread_count: data.unread
            }
        case LOADED_LIST_CHATS_FAIL:
            return {
                ...state,
                loaded: true,
                error: true,
                error_msg: data.message,
                data: [],
                unread_count: false
            }
        case LOADING_CHAT_HISTORY:
            return {
                ...state,
                chat_history: {
                    ready: false
                }
            }
        case LOADED_CHAT_HISTORY_SUCCESS:
            return {
                ...state,
                chat_history: {
                    ...state.chat_history,
                    ready: true,
                    ...data
                }
            }
        case LOADED_CHAT_HISTORY_FAIL:
            return {
                ...state,
                chat_history: {
                    ...state.chat_history,
                    ready: true
                }
            }
        default:
            return state;
    }
}

export default Chats;
