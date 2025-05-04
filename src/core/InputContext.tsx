import React, { createContext, useContext, ReactNode } from 'react';
import { InputContextValue, InputStatus, ValidationResult } from './types';

const defaultContextValue: InputContextValue = {
  status: 'default',
  isRequired: false,
  isDisabled: false,
  isReadOnly: false,
  size: 'medium',
  setStatus: () => {},
  validateInput: async () => ({ isValid: true }),
};

export const InputContext = createContext<InputContextValue>(defaultContextValue);

export const useInputContext = () => useContext(InputContext);

export const InputProvider: React.FC<{
  children: ReactNode;
  value: Partial<InputContextValue>;
}> = ({ children, value }) => {
  const contextValue = { ...defaultContextValue, ...value };
  
  return (
    <InputContext.Provider value={contextValue}>
      {children}
    </InputContext.Provider>
  );
};