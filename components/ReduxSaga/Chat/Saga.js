import { call, all, put, takeLatest, takeEvery } from "redux-saga/effects";
import {axiosConfig} from "../AxiosConfig";
import {GET_ALL_CHAT, GET_CHAT_HISTORY} from "../../API_Definition";
import {GetChatHistorySuccess, GetListChatsFail, GetListChatsSuccess} from "./Actions";
import {LOADING_CHAT_HISTORY, LOADING_LIST_CHATS} from "./ActionTypes";

function* GetAllChats() {
    try {
        const GetAllChatsCall = call(axiosConfig, GET_ALL_CHAT, "get");
        const [GetAllChatsData] = yield all([GetAllChatsCall]);
        yield put(GetListChatsSuccess(GetAllChatsData));
    } catch(e) {
        console.error("SAGA GetAllChats: ", e);
        yield put(GetListChatsFail(e));
    }
}

export function* ChatSaga() {
    yield takeLatest(LOADING_LIST_CHATS, GetAllChats);
}

function* GetChatHistory({data}) {
    const { offset, limit } = data;
    const options = {
        params: {
            offset: offset,
            limit: limit
        }
    }
    console.log(options);
    try {
        const GetChatHistoryCall = call(axiosConfig, GET_CHAT_HISTORY, "get", options);
        const [GetChatHistoryData] = yield all([GetChatHistoryCall]);
        yield put(GetChatHistorySuccess(GetChatHistoryData.data.data));
    } catch(e) {
        console.error("SAGA GetChatHistory: ", e);
        yield put(GetListChatsFail(e));
    }
}

export function* GetChatHistorySaga() {
    yield takeLatest(LOADING_CHAT_HISTORY, GetChatHistory);
}