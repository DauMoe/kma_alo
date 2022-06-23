import axios from "axios";

const DEFAULT_BASE_URL = "http://192.168.110.90";

const instance = axios.create({
    timeout: 1000 * 2,
    baseURL: DEFAULT_BASE_URL
});

export const setBaseUrl = function(baseURL) {
    instance.defaults.baseURL = baseURL;
}

export const setToken = function(token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const axiosConfig = function() {
    console.log("BaseURL: ", instance.defaults.baseURL);
    return instance;
};