import React, { forwardRef, useCallback } from 'react';
import { BaseInputProps } from '../types';
import { BaseInput } from '../BaseInput';

export interface CurrencyInputProps extends BaseInputProps {
  currency?: string;
  locale?: string;
  allowNegative?: boolean;
  precision?: number;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (props, ref) => {
    const {
      currency = 'USD',
      locale = 'en-US',
      allowNegative = false,
      precision = 2,
      onValueChange,
      onChange,
      ...restProps
    } = props;

    // Format currency value
    const formatCurrency = useCallback((value: string | number): string => {
      if (value === '' || value === undefined || value === null) return '';
      
      // Convert to number and handle precision
      let numericValue: number;
      
      if (typeof value === 'string') {
        // Remove currency symbols, commas, and other non-numeric characters except decimal point and minus sign
        const cleanValue = value.replace(new RegExp(`[^0-9${allowNegative ? '\\-' : ''}\\.]`, 'g'), '');
        numericValue = parseFloat(cleanValue);
      } else {
        numericValue = value;
      }
      
      if (isNaN(numericValue)) return '';
      
      // Apply precision
      numericValue = parseFloat(numericValue.toFixed(precision));
      
      // Format using Intl.NumberFormat
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(numericValue);
    }, [currency, locale, allowNegative, precision]);

    // Parse formatted currency to a number
    const parseCurrency = useCallback((formattedValue: string): number => {
      if (!formattedValue) return NaN;
      
      // Remove currency symbols, spaces, and commas
      const cleanValue = formattedValue.replace(/[^\d.-]/g, '');
      return parseFloat(cleanValue);
    }, []);

    // Handle input changes
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      let numericValue: number;
      
      // Handle empty input
      if (!inputValue) {
        onChange?.(e);
        onValueChange?.('');
        return;
      }
      
      // Handle input that only contains a negative sign
      if (inputValue === '-' && allowNegative) {
        onChange?.(e);
        return;
      }
      
      // If user is typing a number with decimal point
      if (/^-?\d*\.?\d*$/.test(inputValue)) {
        numericValue = parseFloat(inputValue);
        if (isNaN(numericValue)) {
          numericValue = 0;
        }
      } else {
        // If input already has currency formatting
        numericValue = parseCurrency(inputValue);
      }
      
      // Apply constraints
      if (!allowNegative && numericValue < 0) {
        numericValue = 0;
      }
      
      // Format the value
      const formattedValue = formatCurrency(numericValue);
      
      // Create a new event with the formatted value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      };
      
      // Call original onChange with the new event
      onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
      
      // Call onValueChange with the numeric value
      onValueChange?.(numericValue);
    }, [formatCurrency, parseCurrency, onChange, onValueChange, allowNegative]);

    // Get currency symbol for prefix
    const getCurrencySymbol = useCallback((): string => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol',
      })
        .formatToParts(0)
        .find(part => part.type === 'currency')?.value || '';
    }, [currency, locale]);

    // Add currency symbol as prefix
    const currencyPrefix = <span className="currency-symbol">{getCurrencySymbol()}</span>;

    return (
      <BaseInput
        ref={ref}
        type="text"
        inputMode="decimal"
        onChange={handleChange}
        prefix={currencyPrefix}
        {...restProps}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';