import React, { forwardRef, useState, useCallback } from 'react';
import { BaseInputProps } from '../types';
import { InputWrapper } from '../InputWrapper';

export interface Tag {
  id: string;
  label: string;
}

export interface TagInputProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
  value?: Tag[];
  onChange?: (tags: Tag[]) => void;
  allowDuplicates?: boolean;
  maxTags?: number;
  suggestions?: Tag[];
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (props, ref) => {
    const {
      id,
      name,
      label,
      hint,
      errorMessage,
      successMessage,
      warningMessage,
      status: propStatus = 'default',
      isRequired = false,
      isDisabled = false,
      isReadOnly = false,
      size = 'medium',
      fullWidth = false,
      value = [],
      onChange,
      allowDuplicates = false,
      maxTags,
      suggestions = [],
      placeholder = 'Add tags...',
      ...restProps
    } = props;

    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      
      if (e.target.value) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, []);

    // Add a new tag
    const addTag = useCallback((tagLabel: string) => {
      if (!tagLabel.trim()) return;
      
      // Check if we've reached the maximum number of tags
      if (maxTags !== undefined && value.length >= maxTags) {
        return;
      }
      
      // Check for duplicates if not allowed
      if (!allowDuplicates && value.some(tag => tag.label.toLowerCase() === tagLabel.toLowerCase())) {
        return;
      }
      
      // Create a new tag
      const newTag: Tag = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        label: tagLabel.trim(),
      };
      
      // Update the tags
      onChange?.([...value, newTag]);
      
      // Clear the input
      setInputValue('');
      setShowSuggestions(false);
    }, [value, onChange, allowDuplicates, maxTags]);

    // Remove a tag
    const removeTag = useCallback((tagId: string) => {
      onChange?.(value.filter(tag => tag.id !== tagId));
    }, [value, onChange]);

    // Handle key down events
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue) {
        e.preventDefault();
        addTag(inputValue);
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        // Remove the last tag when backspace is pressed and input is empty
        removeTag(value[value.length - 1].id);
      }
    }, [inputValue, addTag, removeTag, value]);

    // Handle suggestion click
    const handleSuggestionClick = useCallback((suggestion: Tag) => {
      addTag(suggestion.label);
      
      // Focus back on the input
      inputRef.current?.focus();
    }, [addTag]);

    // Handle blur event
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      // Add the tag if there's text in the input when it loses focus
      if (inputValue.trim()) {
        addTag(inputValue);
      }
      
      // Hide suggestions
      setTimeout(() => {
        setShowSuggestions(false);
      }, 200);
    }, [inputValue, addTag]);

    // Generate CSS classes
    const tagInputClasses = [
      'tag-input-container',
      `tag-input-size-${size}`,
      propStatus !== 'default' ? `tag-input-${propStatus}` : '',
      fullWidth ? 'tag-input-full-width' : '',
    ].filter(Boolean).join(' ');

    // Filter suggestions based on input
    const filteredSuggestions = suggestions.filter(
      suggestion => suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <InputWrapper
        id={id}
        label={label}
        hint={hint}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
        successMessage={successMessage}
        status={propStatus}
        isRequired={isRequired}
        className={fullWidth ? 'tag-input-wrapper-full-width' : ''}
      >
        <div className={tagInputClasses}>
          <div className="tag-input-tags">
            {value.map(tag => (
              <div key={tag.id} className="tag-input-tag">
                <span className="tag-input-tag-label">{tag.label}</span>
                {!isReadOnly && !isDisabled && (
                  <button
                    type="button"
                    className="tag-input-tag-remove"
                    onClick={() => removeTag(tag.id)}
                    aria-label={`Remove ${tag.label}`}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            
            <input
              ref={inputRef}
              type="text"
              className="tag-input-field"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              disabled={isDisabled}
              readOnly={isReadOnly}
              placeholder={value.length === 0 ? placeholder : ''}
              aria-invalid={propStatus === 'error'}
              aria-required={isRequired}
              {...Object.fromEntries(Object.entries(restProps).filter(([key]) => key !== 'prefix'))}
            />
          </div>
          
          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="tag-input-suggestions">
              {filteredSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="tag-input-suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.label}
                </div>
              ))}
            </div>
          )}
          
          {/* Max tags indicator */}
          {maxTags !== undefined && (
            <div className="tag-input-counter">
              {value.length}/{maxTags}
            </div>
          )}
        </div>
      </InputWrapper>
    );
  }
);

TagInput.displayName = 'TagInput';