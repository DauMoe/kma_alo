import { takeEvery, call, takeLatest, put, all } from "redux-saga/effects";
import {LOCAL_LOGIN, LOCAL_SIGNUP} from "../../API_Definition";
import { axiosConfig } from "../AxiosConfig";
import {CHECK_ALL_LOCAL_DATA, SINGING_IN, SIGNING_UP} from "./ActionTypes";
import {
    HostExist,
    HostIsNotExist,
    LocalAuthenFail,
    LocalAuthenSuccess,
    LocalSignSuccess, LocalSignupFail,
    TokenIsExist,
    TokenIsNotExist
} from './Actions';
import { CheckLocalHost, CheckLocalToken } from "../../Utils";
import { HOST_TB_VALUE } from "../../Definition";

function* LocalLogin({data}) {
    const { username, password } = data;
    const reqBody = {
        username: username,
        password: password
    }
    try {
        const LocalLoginCall    = call(axiosConfig, LOCAL_LOGIN, "post", reqBody);
        const [LocalLoginData]  = yield all([LocalLoginCall]);
        yield put(LocalAuthenSuccess(LocalLoginData.data.data.token));
    } catch(e) {
        console.error("SAGA LocalLogin: ", e.message);
        yield put(LocalAuthenFail(e));
    }
}

export function* LocalLoginSaga() {
    yield takeLatest(SINGING_IN, LocalLogin);
}

function* LocalSignup({data}) {
    const { first_name, last_name, username, email, mobile, password } = data;
    const reqBody = {first_name, last_name, username, email, mobile, password}
    try {
        const LocalSignupCall    = call(axiosConfig, LOCAL_SIGNUP, "post", reqBody);
        const [LocalSignupData]  = yield all([LocalSignupCall]);
        yield put(LocalSignSuccess({
            description: LocalSignupData.data.description
        }));
    } catch(e) {
        console.error("SAGA LocalSignup: ", e.response.data);
        yield put(LocalSignupFail(e));
    }
}

export function* LocalSignupSaga() {
    yield takeLatest(SIGNING_UP, LocalSignup);
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
            const BaseURL = HostData.rows.item(0)[`${HOST_TB_VALUE}`];
            yield put(HostExist(BaseURL));
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