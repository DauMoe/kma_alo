import { all } from "redux-saga/effects";
import {CheckAllLocalDataSaga, LocalLoginSaga, LocalSignupSaga} from "./Authenticator/Saga";
import {ChatSaga, GetChatHistorySaga} from "./Chat/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga(), CheckAllLocalDataSaga(), ChatSaga(), GetChatHistorySaga(), LocalSignupSaga()]);
}

export default rootSaga;