"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createD2cApiWithAuth = void 0;
const d2c_client_api_1 = require("./d2c-client-api");
const createD2cApiWithAuth = async (email, password) => {
    const d2cClient = new d2c_client_api_1.D2cApiClient();
    const token = await d2cClient.fetchAuthToken(email, password);
    d2cClient.setToken(token);
    return d2cClient;
};
exports.createD2cApiWithAuth = createD2cApiWithAuth;
