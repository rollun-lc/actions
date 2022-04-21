"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRedApi = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = require("qs");
const core = __importStar(require("@actions/core"));
const axios_retry_1 = __importDefault(require("axios-retry"));
class NodeRedApi {
    api;
    constructor({ baseUrl }) {
        this.api = axios_1.default.create({
            baseURL: baseUrl,
        });
        (0, axios_retry_1.default)(this.api, {
            retries: 3,
            retryDelay: (retryCount) => {
                core.warning(`Retrying ${retryCount} update npm module in node-red`);
                return axios_retry_1.default.exponentialDelay(retryCount);
            },
        });
    }
    async refreshModule(name) {
        const { token, cookie } = await this.getCSRFToken();
        const body = (0, qs_1.stringify)({
            module: name,
            _csrf: token,
        });
        try {
            await this.api.post('/add/node', body, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    cookie: [`${cookie}`],
                },
            });
        }
        catch (err) {
            const status = err.response.status;
            const statusCodeToErrorMessage = {
                400: 'Node already at latest version',
                403: 'Access denied',
            };
            if (status in statusCodeToErrorMessage) {
                throw new Error(statusCodeToErrorMessage[status]);
            }
            throw new Error(err);
        }
    }
    async getCSRFToken() {
        const { data, headers } = await this.api.get('/add/node');
        const [, token] = data.match(/_csrf.+"(.+)"/);
        return { token, cookie: headers['set-cookie'] };
    }
}
exports.NodeRedApi = NodeRedApi;
