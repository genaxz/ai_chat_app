import React from 'react';
import { BaseInputProps, InputStatus } from './types';

interface InputWrapperProps {
  children: React.ReactNode;
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  errorMessage?: string;
  warningMessage?: string;
  successMessage?: string;
  status?: InputStatus;
  isRequired?: boolean;
  renderLabel?: (props: any) => React.ReactElement;
  renderHint?: (props: any) => React.ReactElement;
  className?: string;
}

export const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  id,
  label,
  hint,
  errorMessage,
  warningMessage,
  successMessage,
  status = 'default',
  isRequired = false,
  renderLabel,
  renderHint,
  className,
}) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
  
  // Status message based on current status
  const statusMessage = status === 'error' ? errorMessage 
    : status === 'warning' ? warningMessage 
    : status === 'success' ? successMessage 
    : undefined;

  // Status classes for styling
  const getStatusClasses = () => {
    switch (status) {
      case 'error': return 'input-wrapper--error';
      case 'warning': return 'input-wrapper--warning';
      case 'success': return 'input-wrapper--success';
      case 'loading': return 'input-wrapper--loading';
      default: return '';
    }
  };
  
  return (
    <div className={`input-wrapper ${getStatusClasses()} ${className || ''}`}>
      {/* Label rendering */}
      {label && (
        renderLabel ? (
          renderLabel({ id: inputId, isRequired, label })
        ) : (
          <label htmlFor={inputId} className="input-label">
            {label}
            {isRequired && <span className="input-required-indicator">*</span>}
          </label>
        )
      )}
      
      {/* Input element */}
      {children}
      
      {/* Status message or hint */}
      {statusMessage ? (
        <div className={`input-message input-message--${status}`}>
          {statusMessage}
        </div>
      ) : hint ? (
        renderHint ? (
          renderHint({ id: inputId, hint })
        ) : (
          <div className="input-hint">{hint}</div>
        )
      ) : null}
    </div>
  );
};