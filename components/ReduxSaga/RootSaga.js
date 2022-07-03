import { all } from "redux-saga/effects";
import { CheckAllLocalDataSaga, LocalLoginSaga } from "./Authenticator/Saga";
import {ChatSaga} from "./Chat/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga(), CheckAllLocalDataSaga(), ChatSaga()]);
}

export default rootSaga;