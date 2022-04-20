"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRedApi = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = require("qs");
class NodeRedApi {
    api;
    constructor({ baseUrl }) {
        this.api = axios_1.default.create({
            baseURL: baseUrl,
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
