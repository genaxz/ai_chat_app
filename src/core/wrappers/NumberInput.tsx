import React, { forwardRef, useCallback } from 'react';
import { BaseInput } from '../BaseInput';
import { BaseInputProps } from '../types';

export interface NumberInputProps extends BaseInputProps {
  min?: number;
  max?: number;
  step?: number | 'any';
  precision?: number;
  allowNegative?: boolean;
  thousandSeparator?: string;
  decimalSeparator?: string;
  showControls?: boolean;
  onValueChange?: (value: number | undefined) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (props, ref) => {
    const {
      min,
      max,
      step = 1,
      precision,
      allowNegative = true,
      thousandSeparator,
      decimalSeparator = '.',
      showControls = true,
      onValueChange,
      onChange,
      ...restProps
    } = props;

    // Parse formatted number to raw number
    const parseNumber = useCallback((value: string): number => {
      if (!value) return NaN;

      let parsedValue = value;
      
      // Remove thousand separators if defined
      if (thousandSeparator) {
        parsedValue = parsedValue.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '');
      }
      
      // Replace decimal separator with dot for parsing
      if (decimalSeparator !== '.') {
        parsedValue = parsedValue.replace(new RegExp(`\\${decimalSeparator}`, 'g'), '.');
      }
      
      return parseFloat(parsedValue);
    }, [thousandSeparator, decimalSeparator]);

    // Format number for display
    const formatNumber = useCallback((value: number): string => {
      if (isNaN(value)) return '';
      
      // Apply precision if defined
      let formattedValue = precision !== undefined 
        ? value.toFixed(precision) 
        : value.toString();
      
      // Replace decimal point if needed
      if (decimalSeparator !== '.') {
        formattedValue = formattedValue.replace('.', decimalSeparator);
      }
      
      // Add thousand separators if defined
      if (thousandSeparator) {
        const parts = formattedValue.split(decimalSeparator);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
        formattedValue = parts.join(decimalSeparator);
      }
      
      return formattedValue;
    }, [precision, thousandSeparator, decimalSeparator]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      
      // Check if value is valid
      const isValidInput = !value || new RegExp(
        `^${allowNegative ? '-?' : ''}\\d*${decimalSeparator === '.' ? '\\.' : decimalSeparator}?\\d*$`
      ).test(value);
      
      if (!isValidInput) {
        return;
      }
      
      // Normalize value for further processing
      const numericValue = parseNumber(value);
      
      // Call original onChange
      onChange?.(e);
      
      // Call onValueChange with parsed number
      if (!isNaN(numericValue)) {
        onValueChange?.(numericValue);
      } else {
        onValueChange?.(undefined);
      }
    }, [parseNumber, onChange, onValueChange, allowNegative, decimalSeparator]);

    // Increment/decrement buttons for number input
    const renderSuffixControls = () => {
      if (!showControls) return null;
      
      const increment = () => {
        const currentValue = parseNumber(String(props.value || 0));
        const stepValue = typeof step === 'number' ? step : 1;
        let newValue = (isNaN(currentValue) ? 0 : currentValue) + stepValue;
        
        // Apply constraints
        if (max !== undefined) newValue = Math.min(newValue, max);
        
        onValueChange?.(newValue);
      };
      
      const decrement = () => {
        const currentValue = parseNumber(String(props.value || 0));
        const stepValue = typeof step === 'number' ? step : 1;
        let newValue = (isNaN(currentValue) ? 0 : currentValue) - stepValue;
        
        // Apply constraints
        if (min !== undefined) newValue = Math.max(newValue, min);
        if (!allowNegative) newValue = Math.max(newValue, 0);
        
        onValueChange?.(newValue);
      };
      
      return (
        <div className="number-input-controls">
          <button 
            type="button"
            className="number-input-increment"
            onClick={increment}
            disabled={
              props.isDisabled || 
              (max !== undefined && parseNumber(String(props.value)) >= max)
            }
            aria-label="Increment"
          >
            +
          </button>
          <button 
            type="button"
            className="number-input-decrement"
            onClick={decrement}
            disabled={
              props.isDisabled || 
              (min !== undefined && parseNumber(String(props.value)) <= min) ||
              (!allowNegative && parseNumber(String(props.value)) <= 0)
            }
            aria-label="Decrement"
          >
            −
          </button>
        </div>
      );
    };

    return (
      <BaseInput
        ref={ref}
        type="text"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        suffix={renderSuffixControls()}
        {...restProps}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';