import React, { forwardRef } from 'react';
import { BaseInput } from '../BaseInput';
import { BaseInputProps } from '../types';

// Magnifying glass icon component (replace with your actual icon implementation)
const SearchIcon = () => <span>🔍</span>;
const ClearIcon = () => <span>✖️</span>;

export interface SearchInputProps extends BaseInputProps {
  showClearButton?: boolean;
  onSearch?: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (props, ref) => {
      const {
        showClearButton = true,
        onSearch,
        onClear,
        onKeyDown,
        value,
        ...restProps
      } = props;
  
      // Handle enter key to trigger search
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
          onSearch(String(value || ''));
        }
        onKeyDown?.(e);
      };
  
      // Handle clear button click
      const handleClear = () => {
        onClear?.();
      };
  
      // Render search and clear buttons
      const renderSuffix = () => {
        return (
          <div className="search-input-controls">
            {showClearButton && value && (
              <button
                type="button"
                className="search-input-clear"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            )}
            <button
              type="button"
              className="search-input-button"
              onClick={() => onSearch?.(String(value || ''))}
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        );
      };
  
      return (
        <BaseInput
          ref={ref}
          type="search"
          prefix={<SearchIcon />}
          suffix={renderSuffix()}
          onKeyDown={handleKeyDown}
          value={value}
          {...restProps}
        />
      );
    }
  );
  
  SearchInput.displayName = 'SearchInput';