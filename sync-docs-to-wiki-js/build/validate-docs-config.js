"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequired = exports.validateDocsConfig = void 0;
function validateDocsConfig(config) {
    let errors = [];
    if (!isRequired(config)) {
        errors.push('config is required');
    }
    if (!isRequired(config.config)) {
        errors.push('config.config is required');
    }
    if (!isRequired(config.config.include)) {
        errors.push('config.config.include is required');
    }
    if (!isRequired(config.config.ignore)) {
        errors.push('config.config.ignore is required');
    }
    if (!isArrayOf(config.config.include, 'string')) {
        errors.push('config.config.include must be an array of strings');
    }
    if (!isArrayOf(config.config.ignore, 'string')) {
        errors.push('config.config.ignore must be an array of strings');
    }
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return true;
}
exports.validateDocsConfig = validateDocsConfig;
function isRequired(value) {
    return value !== undefined && value !== null;
}
exports.isRequired = isRequired;
function isArrayOf(value, type) {
    if (!Array.isArray(value)) {
        return false;
    }
    return value.every((item) => typeof item === type);
}
