import { all } from "redux-saga/effects";
import { CheckAllLocalDataSaga, LocalLoginSaga, LocalSignupSaga, SignOutSaga } from "./Authenticator/Saga";
import {ChatSaga, GetChatHistorySaga} from "./Chat/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga(), CheckAllLocalDataSaga(), ChatSaga(), GetChatHistorySaga(), LocalSignupSaga(), SignOutSaga()]);
}

export default rootSaga;
