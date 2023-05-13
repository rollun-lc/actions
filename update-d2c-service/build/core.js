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
exports.updateService = void 0;
const create_d2c_api_with_auth_1 = require("./d2c-api/create-d2c-api-with-auth");
const utils_1 = require("./utils");
const YAML = __importStar(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const validate_config_1 = require("./validate-config");
const populate_config_with_secrets_1 = require("./populate-config-with-secrets");
const updateService = async ({ serviceName, configPath, email, commaSeparatedActions, password, d2cBaseApiUrl, smUsername, smPassword, }) => {
    (0, utils_1.validateActions)(commaSeparatedActions);
    // fallback to serviceName, if no config provided
    const config = configPath
        ? YAML.parse(fs_1.default.readFileSync(configPath, 'utf8'))
        : { 'd2c-service-config': { name: serviceName } };
    const d2cApi = await (0, create_d2c_api_with_auth_1.createD2cApiWithAuth)({ email, password, d2cBaseApiUrl });
    const service = await d2cApi.fetchServiceByName(config['d2c-service-config'].name);
    // if service exists, but no config provided, just use old flow, and trigger update hook.
    if (service && !configPath) {
        await d2cApi.triggerServiceUpdate(service.id, commaSeparatedActions);
        return;
    }
    if (!configPath) {
        throw new Error('configPath is required, if service does not exist. provide your config in configPath, to autocreate/update service');
    }
    if (!(0, validate_config_1.validateConfig)(config)) {
        throw new Error('config is not valid, see messages above');
    }
    if (!smPassword || !smUsername) {
        throw new Error('smPassword and smUsername are required');
    }
    const configWithSecretValues = await (0, populate_config_with_secrets_1.populateConfigWithSecrets)(config, {
        username: smUsername,
        password: smPassword,
    });
    await d2cApi.updateService(config, service);
};
exports.updateService = updateService;
