import React, { forwardRef, useCallback } from 'react';
import { BaseInputProps, InputStatus, ValidationResult } from '../types';
import { BaseInput } from '../BaseInput';

export interface PhoneInputProps extends BaseInputProps {
  format?: 'national' | 'international';
  countryCode?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (props, ref) => {
    const {
      format = 'national',
      countryCode = '1', // Default to US
      onValueChange,
      onChange,
      ...restProps
    } = props;

    // Format phone number as user types
    const formatPhoneNumber = useCallback((value: string): string => {
      if (!value) return '';
      
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      
      if (format === 'national') {
        // Format as (XXX) XXX-XXXX for US
        if (numericValue.length <= 3) {
          return numericValue;
        } else if (numericValue.length <= 6) {
          return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
        } else {
          return `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
        }
      } else {
        // International format: +X XXX XXX XXXX
        return `+${countryCode} ${numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;
      }
    }, [format, countryCode]);

    // Handle input changes to format phone number
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = rawValue.replace(/\D/g, '');
      
      // Format the value
      const formattedValue = formatPhoneNumber(numericValue);
      
      // Update the input value
      e.target.value = formattedValue;
      
      // Call the original onChange
      onChange?.(e);
      
      // Call onValueChange with the numeric value
      onValueChange?.(numericValue);
    }, [formatPhoneNumber, onChange, onValueChange]);

    // Create a validator for phone numbers
    const validatePhoneNumber = useCallback((value: string): ValidationResult => {
      if (!value) return { isValid: true };
      
      const numericValue = value.replace(/\D/g, '');
      
      return {
        isValid: numericValue.length === 10, // Basic validation for US numbers
        message: numericValue.length !== 10 ? 'Please enter a valid 10-digit phone number' : undefined,
        status: numericValue.length === 10 ? 'success' as InputStatus : 'error' as InputStatus,
      };
    }, []);

    // Determine placeholder based on format
    const getPlaceholder = useCallback(() => {
      return format === 'national' ? '(555) 555-5555' : `+${countryCode} 555 555 5555`;
    }, [format, countryCode]);

    // Add phone icon as prefix (this would be your actual icon component)
    const phoneIcon = <span role="img" aria-label="phone">📞</span>;

    return (
      <BaseInput
        ref={ref}
        type="tel"
        inputMode="tel"
        onChange={handleChange}
        prefix={phoneIcon}
        placeholder={getPlaceholder()}
        validators={[validatePhoneNumber]}
        {...restProps}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';