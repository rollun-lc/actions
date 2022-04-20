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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const core_1 = require("./core");
const run = async (exec) => {
    try {
        await exec();
    }
    catch (e) {
        core.setFailed(e.message);
    }
};
const runAction = () => {
    // if (!context.ref.includes(context.payload.repository?.default_branch)) {
    //   console.log('This actions only runs on default branch branches');
    //   return;
    // }
    run(async () => (0, core_1.updateService)({
        serviceName: core.getInput('service-name'),
        email: core.getInput('d2c-email'),
        password: core.getInput('d2c-password'),
        d2cBaseApiUrl: core.getInput('d2c-base-api-url'),
        commaSeparatedActions: core.getInput('actions'),
    }));
};
runAction();
