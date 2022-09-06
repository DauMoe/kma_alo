import axios from "axios";
import { HOST_TABLE, HOST_TB_CREATE_AT, HOST_TB_VALUE, TOKEN_TABLE, TOKEN_TB_VALUE } from "../Definition";
import { _db } from '../Utils';

const sv = 1;

const PRODUCTION_URL                = "20.89.94.38";
const TEST_URL                      = "192.168.1.9";
export const PORT                   = sv === 1 ? 4000 : 8000;
export const HOST                   = sv === 1 ? TEST_URL : PRODUCTION_URL;
export const DEFAULT_BASE_URL       = "http://" + HOST + ":" + PORT;

export const clearToken = function(token) {
    // instance.defaults.headers.common['Authorization'] = undefined;
    const SQL = `DELETE FROM ${TOKEN_TABLE} (${TOKEN_TB_VALUE}) VALUES (?)`;
    _db.transaction(function(tx) {
        tx.executeSql(
            SQL, [token], function(tx1, result) {
                console.log("delete");
                console.log(result);
            }
        );
    });
};

import store from './RootReducer';
let TOKEN, BASE_URL;
store.subscribe(function() {
    const { token, baseUrl } = store.getState().Authenticator;
    // console.log("TOKEN: ", token, baseUrl);
    if (token)      TOKEN       = token;
    if (baseUrl)    BASE_URL    = baseUrl;

    // if (token)      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // if (baseUrl)    axios.defaults.baseURL = baseUrl;
});

export const setBaseUrl = function(baseURL) {
    axios.defaults.baseURL = baseURL;
    _db.transaction(function(tx) {
        tx.executeSql(`INSERT INTO ${HOST_TABLE} (${HOST_TB_VALUE}) VALUES (?)`, [baseURL]);
    });
}

export const axiosConfig = function(endpoint, method, config) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIxLCJlbWFpbCI6ImxlaHV5aG9hbmcxMTExOTk5QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZGF1bW9lMSIsImlhdCI6MTY2MDgzNTg3NCwiZXhwIjoxODc2ODM1ODc0fQ.E-whu03YrSH9KOrqxBIP5aoL6bkDxNX6mvv7qe9yeJM";
    const instance = axios.create({
        baseURL: DEFAULT_BASE_URL
    });
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // if (TOKEN) {
    //     instance.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
    // }
    switch(method.toUpperCase()) {
        case "GET":
            return instance.get(endpoint, config);
        case "POST":
            return instance.post(endpoint, config);
        case "PUT":
            return instance.put(endpoint, config);
        case "DELETE":
            return instance.delete(endpoint, config);
        default:
            return new Error(`Method '${method}' is not supported!`);
    }
}
