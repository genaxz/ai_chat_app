import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { BaseInputProps, InputStatus } from '../types';
import { InputWrapper } from '../InputWrapper';
import { useInputState } from '../useInputState';
import { InputProvider } from '../InputContext';

// Create a more specific interface for TextareaInput that doesn't include input-specific attributes
export interface TextareaInputProps {
  // Core props
  id?: string;
  name: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  status?: InputStatus;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  validators?: any[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  renderPrefix?: (props: any) => React.ReactElement;
  renderSuffix?: (props: any) => React.ReactElement;
  renderLabel?: (props: any) => React.ReactElement;
  renderHint?: (props: any) => React.ReactElement;
  onValueChange?: (value: any) => void;
  onStatusChange?: (status: InputStatus) => void;
  onValidationComplete?: (result: any) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  
  // Textarea specific props
  rows?: number;
  cols?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  placeholder?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  wrap?: 'hard' | 'soft' | 'off';
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (props, ref) => {
    const {
      // Extract props not to be passed to the HTML textarea
      id,
      name,
      label,
      hint,
      prefix,
      suffix,
      errorMessage,
      successMessage,
      warningMessage,
      status: propStatus = 'default',
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      validators,
      validateOnBlur = true,
      validateOnChange = false,
      size = 'medium',
      fullWidth = false,
      renderPrefix,
      renderSuffix,
      renderLabel,
      renderHint,
      onValueChange,
      onStatusChange,
      onValidationComplete,
      value: propValue,
      defaultValue,
      onChange: propOnChange,
      onBlur: propOnBlur,
      onFocus: propOnFocus,
      onKeyDown: propOnKeyDown,
      className,
      style,
      
      // Textarea specific props
      rows = 3,
      cols,
      minRows,
      maxRows,
      autoResize = false,
      maxLength,
      showCharacterCount = false,
      placeholder,
      resize = 'vertical',
      wrap,
      
      // All other props will be filtered
      ...rest
    } = props;

    // Refs and state
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [textareaHeight, setTextareaHeight] = useState<number | undefined>(undefined);
    
    // Set up input state management
    const inputState = useInputState({
      initialValue: propValue !== undefined ? propValue : defaultValue || '',
      name,
      validators: validators || [],
      validateOnBlur,
      validateOnChange,
      onValueChange,
      onStatusChange,
      onValidationComplete,
    });

    // Combine status from props and state
    const status: InputStatus = propStatus !== 'default' ? propStatus : inputState.status;

    // Handle textarea element change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      inputState.setValue(newValue);
      onValueChange?.(newValue);
      propOnChange?.(e);
      
      // Auto-resize logic
      if (autoResize) {
        adjustHeight();
      }
    };

    // Handle textarea element blur
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      inputState.setIsFocused(false);
      inputState.setIsTouched(true);
      
      if (validateOnBlur) {
        inputState.validate();
      }
      
      propOnBlur?.(e);
    };

    // Handle textarea element focus
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      inputState.setIsFocused(true);
      propOnFocus?.(e);
    };

    // Handle key down events
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      propOnKeyDown?.(e);
    };

    // Auto-resize functionality
    const adjustHeight = () => {
      const element = textareaRef.current;
      if (!element) return;
      
      // Reset height temporarily to get the correct scrollHeight
      element.style.height = 'auto';
      
      // Calculate new height
      let newHeight = element.scrollHeight;
      
      // Apply min/max constraints if defined
      if (minRows && newHeight < minRows * 24) { // Assuming 24px per row as approximation
        newHeight = minRows * 24;
      }
      if (maxRows && newHeight > maxRows * 24) {
        newHeight = maxRows * 24;
      }
      
      setTextareaHeight(newHeight);
    };

    // Initialize height and set up listeners
    useEffect(() => {
      if (autoResize) {
        adjustHeight();
        
        // Listen for window resize to readjust height
        window.addEventListener('resize', adjustHeight);
        return () => {
          window.removeEventListener('resize', adjustHeight);
        };
      }
    }, [autoResize, inputState.value]);

    // Handle ref forwarding
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    // Context value for potential child components
    const contextValue = {
      status,
      errorMessage: inputState.errorMessage || errorMessage,
      warningMessage,
      successMessage,
      isRequired,
      isDisabled,
      isReadOnly,
      size,
      setStatus: inputState.setStatus,
      validateInput: inputState.validate,
    };

    // Generate CSS classes for textarea styling
    const textareaClasses = [
      'textarea-input',
      `textarea-size-${size}`,
      status !== 'default' ? `textarea-${status}` : '',
      fullWidth ? 'textarea-full-width' : '',
      className || '',
    ].filter(Boolean).join(' ');

    // Calculate remaining characters if maxLength is provided
    const remainingChars = maxLength !== undefined 
      ? maxLength - String(inputState.value || '').length 
      : undefined;

    // Custom textarea styling
    const textareaStyle = {
      ...style,
      height: textareaHeight ? `${textareaHeight}px` : undefined,
      resize: resize,
    };

    return (
      <InputProvider value={contextValue}>
        <InputWrapper
          id={id}
          label={label}
          hint={hint}
          errorMessage={inputState.errorMessage || errorMessage}
          warningMessage={warningMessage}
          successMessage={successMessage}
          status={status}
          isRequired={isRequired}
          renderLabel={renderLabel}
          renderHint={renderHint}
          className={fullWidth ? 'textarea-wrapper-full-width' : ''}
        >
          <div className="textarea-container">
            {/* Prefix element */}
            {prefix && (
              <div className="textarea-prefix">
                {renderPrefix ? renderPrefix({ status }) : prefix}
              </div>
            )}
            
            {/* The actual textarea element */}
            <textarea
              ref={textareaRef}
              id={id}
              name={name}
              value={propValue !== undefined ? propValue : inputState.value}
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={isRequired}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className={textareaClasses}
              style={textareaStyle}
              rows={rows}
              cols={cols}
              maxLength={maxLength}
              placeholder={placeholder}
              wrap={wrap}
              aria-invalid={status === 'error'}
              aria-required={isRequired}
              aria-disabled={isDisabled}
            />
            
            {/* Suffix element */}
            {suffix && (
              <div className="textarea-suffix">
                {renderSuffix ? renderSuffix({ status }) : suffix}
              </div>
            )}
          </div>
          
          {/* Character counter */}
          {showCharacterCount && maxLength !== undefined && (
            <div className={`textarea-char-count ${remainingChars! <= 10 ? 'textarea-char-count--low' : ''}`}>
              {remainingChars} characters remaining
            </div>
          )}
        </InputWrapper>
      </InputProvider>
    );
  }
);

TextareaInput.displayName = 'TextareaInput';