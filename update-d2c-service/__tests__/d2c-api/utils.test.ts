import {
  createUpdateWebhookByServiceId,
  findServiceByName,
} from '../../src/d2c-api/utils';
import { D2cApiClient } from '../../src/d2c-api/d2c-client-api';

describe('Test d2c-api/utils module', () => {
  describe('Test findServiceByName function', () => {
    test('if returns service by name', () => {
      const services = [
        { id: 'test1', name: 'test1' },
        { id: 'test2', name: 'test2' },
      ];

      expect(findServiceByName(services, 'test1')).toEqual({
        id: 'test1',
        name: 'test1',
      });
    });
    test('if returns undefined if service is not present in array', () => {
      const services = [{ id: 'test1', name: 'test1' }];

      expect(findServiceByName(services, 'test3')).toEqual(undefined);
    });
  });
  describe('Test createUpdateWebhookByServiceId function', () => {
    test('if returns correct webhook url', () => {
      expect(createUpdateWebhookByServiceId('testId', 'someaction')).toEqual(
        `${D2cApiClient.baseUrl}hook/service/testId?actions=someaction`,
      );
    });
  });
});
