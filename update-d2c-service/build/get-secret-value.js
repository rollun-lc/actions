"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.resolveSecrets = exports.getSecretValue = void 0;
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
async function getSecretValue(name, baseUrl, auth) {
    const axiosInstance = axios_1.default.create({
        baseURL: baseUrl,
        headers: {
            Authorization: `Bearer ${generateSmGhResolverToken(`${auth.username}:${auth.password}`)}`,
        }
    });
    const { data: secret } = await axiosInstance.get(`/${name}`);
    return secret.value;
}
exports.getSecretValue = getSecretValue;
async function resolveSecrets(smUrl, names, auth) {
    const headers = {
        Authorization: `Bearer ${generateSmGhResolverToken(`${auth.username}:${auth.password}`)}`,
    };
    const data = {
        ids: names,
    };
    const response = await axios_1.default.post(smUrl, data, { headers });
    const missingSecrets = [];
    for (const { id, secret } of response.data.resolved) {
        if (secret === null) {
            missingSecrets.push(id);
        }
    }
    if (missingSecrets.length > 0) {
        throw new Error(`Some secrets not resolved: ${missingSecrets.join(', ')}`);
    }
    return response.data.resolved.map(({ id, secret }) => ({ name: id, value: secret?.value }));
}
exports.resolveSecrets = resolveSecrets;
function generateSmGhResolverToken(secret) {
    const token = jwt.sign({}, secret, {
        algorithm: 'HS256',
        expiresIn: '1m',
        issuer: 'https://github.com/rollun-lc/actions/update-d2c-service',
        subject: 'https://github.com/rollun-lc/actions/update-d2c-service',
        audience: '/openapi/RollunSecretManager/v1/secrets/resolve',
    });
    return token;
}
