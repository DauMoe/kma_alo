import { call, all, put, takeLatest } from "redux-saga/effects";
import {axiosConfig} from "../AxiosConfig";
import {GET_ALL_CHAT} from "../../API_Definition";
import {GetListChatsFail, GetListChatsSuccess} from "./Actions";
import {LOADING_LIST_CHATS} from "./ActionTypes";

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