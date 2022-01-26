import { validateActions } from '../src/utils';

describe('Test utils module', () => {
  describe('validateActions function', () => {
    test('if throws error on invalid actions', () => {
      const createInvalidCaseCallback = (invalidCase) => () => {
        validateActions(invalidCase);
      };
      const invalidActionCases = ['wrongAction', 'restart, updateSources'];

      for (const invalidActionCase of invalidActionCases) {
        expect(createInvalidCaseCallback(invalidActionCase)).toThrowError();
      }
    });
    test('if does not throw error on valid actions', () => {
      const validActionCases = ['restart', 'restart,updateSources'];

      for (const validActionCase of validActionCases) {
        expect(validateActions(validActionCase)).toEqual(undefined);
      }
    });
  });
});
