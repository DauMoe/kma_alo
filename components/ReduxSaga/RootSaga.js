import { all } from "redux-saga/effects";
import LocalLoginSaga from "./Authenticator/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga()]);
}

export default rootSaga;