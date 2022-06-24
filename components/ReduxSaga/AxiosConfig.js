import axios from "axios";

const DEFAULT_BASE_URL = "http://192.168.1.36:8080";

const instance = axios.create({
    timeout: 1000 * 1,
    baseURL: DEFAULT_BASE_URL
});

export const setBaseUrl = function(baseURL) {
    instance.defaults.baseURL = baseURL;
}

export const setToken = function(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const axiosConfig = function(endpoint, method, config) {
    // console.log("BaseURL: ", instance.defaults.baseURL);
    method = method.toUpperCase();
    switch(method) {
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
};