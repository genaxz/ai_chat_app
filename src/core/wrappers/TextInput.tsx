import React, { forwardRef } from 'react';
import { BaseInputProps } from '../types';
import { BaseInput } from '../BaseInput';

export interface TextInputProps extends BaseInputProps {
  // Add any text-specific props here
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  autoCorrect?: 'on' | 'off';
  spellCheck?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props, ref) => {
    return <BaseInput ref={ref} type="text" {...props} />;
  }
);

TextInput.displayName = 'TextInput';