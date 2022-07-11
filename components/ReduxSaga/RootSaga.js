import { all } from "redux-saga/effects";
import { CheckAllLocalDataSaga, LocalLoginSaga } from "./Authenticator/Saga";
import {ChatSaga, GetChatHistorySaga} from "./Chat/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga(), CheckAllLocalDataSaga(), ChatSaga(), GetChatHistorySaga()]);
}

export default rootSaga;