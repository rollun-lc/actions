"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMdFileMetadata = void 0;
function validateMdFileMetadata(metadata) {
    let errors = [];
    if (typeof metadata !== 'object') {
        errors.push('metadata must be an object');
    }
    if (typeof metadata.tags !== 'string') {
        errors.push('metadata.tags must be a string separated by commas');
    }
    if (typeof metadata.title !== 'string') {
        errors.push('metadata.title must be a string');
    }
    if (typeof metadata.description !== 'string') {
        errors.push('metadata.description must be a string');
    }
    if (metadata.isPrivate && typeof metadata.isPrivate !== 'boolean') {
        errors.push('metadata.isPrivate must be a boolean');
    }
    if (metadata.isPublished && typeof metadata.isPublished !== 'boolean') {
        errors.push('metadata.isPublished must be a boolean');
    }
    if (metadata.locale && typeof metadata.locale !== 'string') {
        errors.push('metadata.locale must be a string');
    }
    if (metadata.path && typeof metadata.path !== 'string') {
        errors.push('metadata.path must be a string');
    }
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    return true;
}
exports.validateMdFileMetadata = validateMdFileMetadata;
