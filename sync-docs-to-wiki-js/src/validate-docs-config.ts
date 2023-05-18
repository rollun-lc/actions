export type DocsConfig = {
  config: {
    include: string[];
    ignore: string[];
  };
};

export function validateDocsConfig(config: any): config is DocsConfig {
  let errors: string[] = [];

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

export function isRequired(value: any): boolean {
  return value !== undefined && value !== null;
}

function isArrayOf(value: any, type: string): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => typeof item === type);
}
