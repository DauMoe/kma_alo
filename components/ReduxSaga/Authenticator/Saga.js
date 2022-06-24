import { takeEvery, call, takeLatest, put, all } from "redux-saga/effects";
import { LOCAL_LOGIN } from "../../API_Definition";
import { axiosConfig } from "../AxiosConfig";
import { SINGING_IN } from "./ActionTypes";
import { LocalAuthenFail, LocalAuthenSuccess } from './Actions';

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

export default LocalLoginSaga;

