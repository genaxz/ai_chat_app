import { ValidationResult, ValidatorFn } from './types';

// Required field validator
export const required = (message = 'This field is required'): ValidatorFn => 
  (value) => ({
    isValid: !!value && (typeof value === 'string' ? value.trim().length > 0 : true),
    message,
    status: 'error',
  });

// Minimum length validator
export const minLength = (min: number, message?: string): ValidatorFn => 
  (value) => ({
    isValid: !value || String(value).length >= min,
    message: message || `Must be at least ${min} characters`,
    status: 'error',
  });

// Maximum length validator
export const maxLength = (max: number, message?: string): ValidatorFn => 
  (value) => ({
    isValid: !value || String(value).length <= max,
    message: message || `Cannot exceed ${max} characters`,
    status: 'error',
  });

// Pattern validator
export const pattern = (regex: RegExp, message: string): ValidatorFn => 
  (value) => ({
    isValid: !value || regex.test(String(value)),
    message,
    status: 'error',
  });

// Email validator
export const email = (message = 'Please enter a valid email address'): ValidatorFn => 
  pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message);

// URL validator
export const url = (message = 'Please enter a valid URL'): ValidatorFn => 
  pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*\/?$/, message);

// Number validator
export const isNumber = (message = 'Please enter a valid number'): ValidatorFn => 
  (value) => ({
    isValid: !value || !isNaN(Number(value)),
    message,
    status: 'error',
  });

// Min value validator
export const min = (minValue: number, message?: string): ValidatorFn => 
  (value) => ({
    isValid: !value || isNaN(Number(value)) || Number(value) >= minValue,
    message: message || `Value must be at least ${minValue}`,
    status: 'error',
  });

// Max value validator
export const max = (maxValue: number, message?: string): ValidatorFn => 
  (value) => ({
    isValid: !value || isNaN(Number(value)) || Number(value) <= maxValue,
    message: message || `Value must be at most ${maxValue}`,
    status: 'error',
  });

// Custom validator with function
export const custom = (
  validationFn: (value: any, context?: any) => boolean | Promise<boolean>, 
  message = 'Validation failed'
): ValidatorFn => 
  async (value, context) => {
    try {
      const isValid = await validationFn(value, context);
      return {
        isValid,
        message: isValid ? undefined : message,
        status: isValid ? 'success' : 'error',
      };
    } catch (error) {
      return {
        isValid: false,
        message: error instanceof Error ? error.message : message,
        status: 'error',
      };
    }
  };

// Compose multiple validators
export const compose = (validators: ValidatorFn[]): ValidatorFn => 
  async (value, context) => {
    for (const validator of validators) {
      const result = await validator(value, context);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, status: 'success' };
  };