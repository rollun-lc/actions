"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateActions = void 0;
// action format is - action1,action2
// example 1
// input: action1,action2
// result: no error is thrown
// example 2
// input: action1 , action2
// result: error is thrown
const availableActions = [
    'restart',
    'updateSources',
    'updateLocalDeps',
    'updateGlobalDeps',
    'updateVersion',
];
const validateActions = (actions) => {
    const actionsArray = actions.split(',');
    const invalidActions = [];
    for (const action of actionsArray) {
        if (!availableActions.includes(action)) {
            invalidActions.push(action);
        }
    }
    if (invalidActions.length !== 0) {
        throw new Error(`Invalid actions were provided - [${invalidActions.join(',')}]. Supported actions are - [${availableActions.join(',')}]`);
    }
};
exports.validateActions = validateActions;
