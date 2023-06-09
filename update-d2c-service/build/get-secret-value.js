"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretValue = void 0;
const axios_1 = __importDefault(require("axios"));
async function getSecretValue(name, baseUrl, auth) {
    const axiosInstance = axios_1.default.create({
        baseURL: baseUrl,
        auth: auth,
    });
    const { data: secret } = await axiosInstance.get(`/${name}`);
    return secret.value;
}
exports.getSecretValue = getSecretValue;
