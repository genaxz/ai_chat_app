import { useState, useCallback, useEffect } from 'react';
import { InputState, ValidationResult, ValidatorFn, InputStatus } from './types';

interface UseInputStateProps {
  initialValue?: any;
  name: string;
  validators?: ValidatorFn[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  onValueChange?: (value: any) => void;
  onStatusChange?: (status: InputStatus) => void;
  onValidationComplete?: (result: ValidationResult) => void;
}

export const useInputState = ({
  initialValue = '',
  name,
  validators = [],
  validateOnBlur = true,
  validateOnChange = false,
  onValueChange,
  onStatusChange,
  onValidationComplete,
}: UseInputStateProps): InputState => {
  const [value, setValue] = useState<any>(initialValue);
  const [status, setStatus] = useState<InputStatus>('default');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isDirty, setIsDirty] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Run validation logic
  const validate = useCallback(async (): Promise<ValidationResult> => {
    if (validators.length === 0) {
      return { isValid: true };
    }

    // Run all validators
    for (const validator of validators) {
      try {
        const result = await validator(value);
        if (!result.isValid) {
          setStatus('error');
          setErrorMessage(result.message);
          onStatusChange?.('error');
          onValidationComplete?.(result);
          return result;
        }
      } catch (error) {
        const errorResult = { 
          isValid: false, 
          message: error instanceof Error ? error.message : 'Validation error'
        };
        setStatus('error');
        setErrorMessage(errorResult.message);
        onStatusChange?.('error');
        onValidationComplete?.(errorResult);
        return errorResult;
      }
    }

    // All validations passed
    setStatus('success');
    setErrorMessage(undefined);
    onStatusChange?.('success');
    const successResult = { isValid: true };
    onValidationComplete?.(successResult);
    return successResult;
  }, [value, validators, onStatusChange, onValidationComplete]);

  // Handle input element change - works with any HTML element that has a value
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsDirty(true);
    
    onValueChange?.(newValue);
    
    if (validateOnChange) {
      validate();
    }
  }, [setValue, validateOnChange, validate, onValueChange]);

  // Handle input element blur
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setIsFocused(false);
    setIsTouched(true);
    
    if (validateOnBlur) {
      validate();
    }
  }, [setIsFocused, validateOnBlur, validate]);

  // Handle input element focus
  const handleFocus = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setIsFocused(true);
  }, [setIsFocused]);

  // Reset the input state
  const reset = useCallback(() => {
    setValue(initialValue);
    setStatus('default');
    setErrorMessage(undefined);
    setIsDirty(false);
    setIsTouched(false);
    setIsFocused(false);
  }, [initialValue]);

  // Effect to run when value changes externally
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== value) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return {
    value,
    setValue,
    status,
    setStatus,
    errorMessage,
    setErrorMessage,
    isValid: status !== 'error',
    isDirty,
    isTouched,
    isFocused,
    setIsDirty,
    setIsTouched,
    setIsFocused,
    handleChange,
    handleBlur,
    handleFocus,
    validate,
    reset,
  };
};