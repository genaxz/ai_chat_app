import { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, RefObject, ReactElement } from 'react';

// Status types to represent different input states
export type InputStatus = 'default' | 'error' | 'success' | 'warning' | 'loading';

// Base validation result
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  status?: InputStatus;
}

// Validator function type
export type ValidatorFn = (value: any, context?: any) => ValidationResult | Promise<ValidationResult>;

// HTML element types that can be used with our components
export type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Base props that all input components will share
export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  // Identification
  id?: string;
  name: string;
  
  // Visual and content props
  label?: ReactNode;
  hint?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  
  // State and behavior
  status?: InputStatus;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  
  // Validation
  validators?: ValidatorFn[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  
  // Layout and size
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  
  // Render props and extensions
  renderPrefix?: (props: any) => ReactElement;
  renderSuffix?: (props: any) => ReactElement;
  renderLabel?: (props: any) => ReactElement;
  renderHint?: (props: any) => ReactElement;
  
  // Callbacks
  onValueChange?: (value: any) => void;
  onStatusChange?: (status: InputStatus) => void;
  onValidationComplete?: (result: ValidationResult) => void;
}

// Input context value interface
export interface InputContextValue {
  status: InputStatus;
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
  isRequired: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  size: 'small' | 'medium' | 'large';
  setStatus: (status: InputStatus) => void;
  validateInput: (value: any) => Promise<ValidationResult>;
}

// Input state hook return type
export interface InputState {
  value: any;
  setValue: (value: any) => void;
  status: InputStatus;
  setStatus: (status: InputStatus) => void;
  errorMessage?: string;
  setErrorMessage: (message?: string) => void;
  isValid: boolean;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  isTouched: boolean;
  setIsTouched(isTouched: boolean): void;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  handleChange: (e: React.ChangeEvent<InputElement>) => void;
  handleBlur: (e: React.FocusEvent<InputElement>) => void;
  handleFocus: (e: React.FocusEvent<InputElement>) => void;
  validate: () => Promise<ValidationResult>;
  reset: () => void;
}

// Base textarea props derived from BaseInputProps but using TextareaHTMLAttributes
export interface BaseTextareaProps extends Omit<BaseInputProps, keyof TextareaHTMLAttributes<HTMLTextAreaElement>> {
  // Add any textarea-specific props here
}