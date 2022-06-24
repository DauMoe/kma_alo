import { takeEvery, call, takeLatest, put, all } from "redux-saga/effects";
import { LOCAL_LOGIN } from "../../API_Definition";
import { axiosConfig } from "../AxiosConfig";
import { SINGING_IN } from "./ActionTypes";
import { HostExist, HostIsNotExist, LocalAuthenFail, LocalAuthenSuccess, TokenIsExist, TokenIsNotExist } from './Actions';
import { CHECK_ALL_LOCAL_DATA } from "../CheckLocalData/ActionTypes";
import { CheckLocalHost, CheckLocalToken } from "../../Utils";

function* LocalLogin({data}) {
    const { username, password } = data;
    const reqBody = {
        username: username,
        password: password
    }
    try {
        const LocalLoginCall    = call(axiosConfig, LOCAL_LOGIN, "post", reqBody);
        const [LocalLoginData]  = yield all([LocalLoginCall]);
        console.log(LocalLoginData);
        yield put(LocalAuthenSuccess({
            token: "ffffff"
        }));
    } catch(e) {
        yield put(LocalAuthenFail(e));
    }
}

export function* LocalLoginSaga() {
    yield takeLatest(SINGING_IN, LocalLogin);
}

function* CheckAllLocalData() {
    try {
        const CheckLocalHostCall    = call(CheckLocalHost);
        const CheckLocalTokenCall   = call(CheckLocalToken);
        const [HostData, TokenData] = yield all([CheckLocalHostCall, CheckLocalTokenCall]);
        const HostDataLength        = HostData.rows.length;
        const TokenDataLength       = TokenData.rows.length;
        
        if (HostDataLength === 0) {
            yield put(HostIsNotExist());
        } else {
            yield put(HostExist("http://192.168.1.1"));
        }
        
        if (TokenDataLength === 0) {
            yield put(TokenIsNotExist());
        } else {
            yield put(TokenIsExist({
                token: "ffff"
            }));
        }
    } catch(e) {
        yield put(HostIsNotExist());
        yield put(TokenIsNotExist());
        console.log("Saga.js - CheckLocalData: ", e);
    }
}

export function* CheckAllLocalDataSaga() {
    yield takeEvery(CHECK_ALL_LOCAL_DATA, CheckAllLocalData);
}