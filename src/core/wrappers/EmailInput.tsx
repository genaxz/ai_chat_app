import React, { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { BaseInputProps } from '../types';
import { compose, email, required } from '../validators';

export interface EmailInputProps extends BaseInputProps {
  validateOnInput?: boolean;
  autoComplete?: 'email' | 'off' | 'on';
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (props, ref) => {
    const {
      validateOnInput = false,
      isRequired: propIsRequired = false,
      validators = [],
      ...restProps
    } = props;

    // Combine validators, adding email validation
    const combinedValidators = propIsRequired
      ? [...validators, compose([required(), email()])]
      : [...validators, email()];

    return (
      <BaseInput
        ref={ref}
        type="email"
        autoComplete="email"
        validateOnChange={validateOnInput}
        validators={combinedValidators}
        isRequired={propIsRequired}
        {...restProps}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';