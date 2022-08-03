import { takeEvery, call, takeLatest, put, all } from "redux-saga/effects";
import { CHECK_VALID_TOKEN, LOCAL_LOGIN, LOCAL_SIGNUP } from "../../API_Definition";
import { axiosConfig } from "../AxiosConfig";
import { CHECK_ALL_LOCAL_DATA, SINGING_IN, SIGNING_UP, SIGNED_IN_SUCESS, SIGNING_OUT } from "./ActionTypes";
import {
    HostExist,
    HostIsNotExist,
    LocalAuthenFail,
    LocalAuthenSuccess,
    LocalSignSuccess, LocalSignupFail,
    TokenIsExist,
    TokenIsNotExist
} from './Actions';
import { CheckLocalHost, CheckLocalToken, RemoveToken, SaveToken } from "../../Utils";
import { TOKEN_TB_VALUE } from "../../Definition";

function* LocalLogin({data}) {
    const { username, password } = data;
    const reqBody = {
        username: username,
        password: password
    }
    try {
        const LocalLoginCall    = call(axiosConfig, LOCAL_LOGIN, "post", reqBody);
        const [LocalLoginData]  = yield all([LocalLoginCall]);
        const token             = LocalLoginData.data.data.token;
        yield call(SaveToken, token);
        yield put(LocalAuthenSuccess(token));
    } catch(e) {
        console.error("SAGA LocalLogin: ", e.response.data);
        yield put(LocalAuthenFail(e.response));
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
        // const HostDataLength        = HostData.rows.length;
        const TokenDataLength       = TokenData.rows.length;

        // if (HostDataLength === 0) {
        //     yield put(HostIsNotExist());
        // } else {
        //     const BaseURL = HostData.rows.item(0)[`${HOST_TB_VALUE}`];
        //     yield put(HostExist(BaseURL));
        // }

        if (TokenDataLength === 0) {
            yield put(TokenIsNotExist());
        } else {
            const token = TokenData.rows.item(0)[TOKEN_TB_VALUE]
            const CheckValid = yield call(axiosConfig, CHECK_VALID_TOKEN, "get", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            yield put(TokenIsExist({
                token: token
            }));
        }
    } catch(e) {
        // yield put(HostIsNotExist());
        yield put(TokenIsNotExist());
        console.log("Saga.js - CheckLocalData: ", e.response);
    }
}

export function* CheckAllLocalDataSaga() {
    yield takeEvery(CHECK_ALL_LOCAL_DATA, CheckAllLocalData);
}

function* SignOut() {
    try {
        yield call(RemoveToken);
    } catch (e) {
        console.log("Saga.js - SignOut: ", e.response);
    }
}

export function* SignOutSaga() {
    yield takeEvery(SIGNING_OUT, SignOut);
}
