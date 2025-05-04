import React, { forwardRef, useState } from 'react';
import { BaseInput } from '../BaseInput';
import { BaseInputProps } from '../types';

// You would implement actual icon components in your project
const EyeIcon = () => <span>👁️</span>;
const EyeSlashIcon = () => <span>👁️‍🗨️</span>;

export interface PasswordInputProps extends BaseInputProps {
  showToggle?: boolean;
  togglePosition?: 'left' | 'right';
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const {
      showToggle = true,
      togglePosition = 'right',
      ...restProps
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Password toggle button
    const passwordToggle = (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="password-toggle-button"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
      </button>
    );

    return (
      <BaseInput
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        prefix={showToggle && togglePosition === 'left' ? passwordToggle : undefined}
        suffix={showToggle && togglePosition === 'right' ? passwordToggle : undefined}
        {...restProps}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';