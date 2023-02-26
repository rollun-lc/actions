import { D2CServiceConfig } from './d2c-api/types';
import * as core from '@actions/core';

export function validateConfig(config: any): config is D2CServiceConfig {
  let errors: string[] = [];
  if (!config['initial-service-host']) {
    errors.push('initial-service-host is required');
  }

  if (!config['d2c-service-config']) {
    errors.push('d2c-service-config is required');
  }

  if (config['d2c-service-config'].name?.length > 16) {
    errors.push('d2c-service-config.name must be 16 characters or less');
  }

  errors.forEach((error) => {
    core.error(error);
  });

  return errors.length === 0;
}