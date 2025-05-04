import React, { forwardRef, useCallback } from 'react';
import { BaseInputProps, InputStatus } from './types';
import { InputWrapper } from './InputWrapper';
import { useInputState } from './useInputState';
import { InputProvider } from './InputContext';

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (props, ref) => {
    const {
      // Extract props not to be passed to the HTML input
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
      className,
      style,
      
      // All other props
      ...htmlInputProps
    } = props;

    // Set up input state management
    const inputState = useInputState({
      initialValue: propValue !== undefined ? propValue : defaultValue || '',
      name,
      validators,
      validateOnBlur,
      validateOnChange,
      onValueChange,
      onStatusChange,
      onValidationComplete,
    });

    // Combine status from props and state
    const status: InputStatus = propStatus !== 'default' ? propStatus : inputState.status;

    // Handle input element change
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      inputState.handleChange(e);
      propOnChange?.(e);
    }, [inputState.handleChange, propOnChange]);

    // Handle input element blur
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      inputState.handleBlur(e);
      propOnBlur?.(e);
    }, [inputState.handleBlur, propOnBlur]);

    // Handle input element focus
    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      inputState.handleFocus(e);
      propOnFocus?.(e);
    }, [inputState.handleFocus, propOnFocus]);

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

    // Generate CSS classes for input styling
    const inputClasses = [
      'base-input',
      `input-size-${size}`,
      status !== 'default' ? `input-${status}` : '',
      fullWidth ? 'input-full-width' : '',
      className || '',
    ].filter(Boolean).join(' ');

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
          className={fullWidth ? 'input-wrapper-full-width' : ''}
        >
          <div className="input-container">
            {/* Prefix element */}
            {prefix && (
              <div className="input-prefix">
                {renderPrefix ? renderPrefix({ status }) : prefix}
              </div>
            )}
            
            {/* The actual input element */}
            <input
              ref={ref}
              id={id}
              name={name}
              value={propValue !== undefined ? propValue : inputState.value}
              disabled={isDisabled}
              readOnly={isReadOnly}
              required={isRequired}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={inputClasses}
              style={style}
              aria-invalid={status === 'error'}
              aria-required={isRequired}
              aria-disabled={isDisabled}
              {...htmlInputProps}
            />
            
            {/* Suffix element */}
            {suffix && (
              <div className="input-suffix">
                {renderSuffix ? renderSuffix({ status }) : suffix}
              </div>
            )}
          </div>
        </InputWrapper>
      </InputProvider>
    );
  }
);

BaseInput.displayName = 'BaseInput';