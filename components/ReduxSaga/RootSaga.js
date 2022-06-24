import { all } from "redux-saga/effects";
import { CheckAllLocalDataSaga, LocalLoginSaga } from "./Authenticator/Saga";

function* rootSaga() {
    yield all([LocalLoginSaga(), CheckAllLocalDataSaga()]);
}

export default rootSaga;